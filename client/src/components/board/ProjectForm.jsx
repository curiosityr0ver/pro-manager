import { IoAdd } from "react-icons/io5";
import styles from "../css/TaskForm.module.scss";
import Button from "../form-inputs/Button";
import { useRef, useState } from "react";
import { MdDelete } from "react-icons/md";
import { format } from "date-fns";
import { createTask, editTask } from "../../apis/tasks";
import { createProject } from "../../apis/projects";

function ProjectForm({
	notifyError,
	notifySuccess,
	removePopupModal,
	task: prevProject = null,
	updateTask,
	addTask,
}) {
	const [project, setProject] = useState({
		title: prevProject?.title || "",
		description: prevProject?.description || "",
		dueDate: prevProject?.dueDate || "",
	});
	const [members, setMembers] = useState([]);
	const [processing, setProcessing] = useState(false);
	const datePickerRef = useRef();

	const addNewList = () => {
		setMembers((prev) => [...prev, { isAdmin: false, description: "" }]);
	};

	const handleList = (index, operation, desc = "") => {
		switch (operation) {
			case "check":
				setMembers((prev) =>
					prev.map((list, idx) =>
						idx === index ? { ...list, isAdmin: !list.isChecked } : list
					)
				);
				break;
			case "text":
				setMembers((prev) =>
					prev.map((list, idx) =>
						idx === index ? { ...list, description: desc } : list
					)
				);
				break;
			case "delete":
				setMembers((prev) => prev.filter((_, idx) => idx !== index));
				break;
			default:
				break;
		}
	};

	const handleTaskSubmit = async (e) => {
		e.preventDefault();
		setProcessing(true);
		let error = "";

		//Error Handling
		if (!project.title.trim()) error = "Title is required";
		else if (!members.length) error = "Atleast one admin is required";
		else if (members.some((list) => list.description.trim() === ""))
			error = "Every entry needs an email";

		if (error) {
			notifyError(error);
			setProcessing(false);
			return;
		}

		project.members = members;

		// return console.log(project);

		const { data: projectData, error: projectError } = !prevProject?._id
			? await createProject(project)
			: await editTask(project, prevProject._id);

		if (projectError || projectData.statusCode != 201) {
			notifyError(projectError);
			setProcessing(false);
		} else {
			console.log(projectData);
			!prevProject?._id
				? notifySuccess("New Project Created!")
				: notifySuccess("Project Updated!");
			!prevProject?._id
				? addTask(projectData)
				: updateTask(prevProject.state, projectData, prevProject._id);
			setProcessing(false);
			removePopupModal();
		}
	};

	return (
		<div className={styles.task_form}>
			<form onSubmit={(e) => handleTaskSubmit(e)}>
				<div className={styles.title}>
					<label htmlFor="task-title">
						Title <span>*</span>
					</label>
					<input
						type="text"
						value={project.title}
						onChange={(e) =>
							setProject((prev) => ({ ...prev, title: e.target.value }))
						}
						name="title"
						id="task-title"
						placeholder="Enter Project Title"
					/>
					<label htmlFor="task-desc">
						Description <span>*</span>
					</label>
					<input
						type="text"
						value={project.description}
						onChange={(e) =>
							setProject((prev) => ({ ...prev, description: e.target.value }))
						}
						name="title"
						id="task-title"
						placeholder="Enter Project Description"
					/>
				</div>
				<div className={styles.checklist}>
					<label>Members {members.length}</label>
					{
						<div>
							{members.map((list, index) => (
								<Checklist
									key={list._id ?? index}
									list={list}
									index={index}
									handleList={handleList}
								/>
							))}
						</div>
					}
					<button type="button" onClick={addNewList}>
						<IoAdd /> Add New
					</button>
				</div>
				<div className={styles.footer}>
					<button
						type="button"
						className={styles.date_input}
						onClick={() => datePickerRef.current.showPicker()}
					>
						{project.dueDate
							? format(project.dueDate, "MM/dd/yyyy")
							: "Select Due Date"}
					</button>
					<input
						type="date"
						ref={datePickerRef}
						name="dueDate"
						style={{ visibility: "hidden" }}
						value={project.dueDate}
						onChange={(e) =>
							setProject((prev) => ({ ...prev, dueDate: e.target.value }))
						}
					/>
					<div>
						<button onClick={() => removePopupModal()}>Cancel</button>
						<Button processing={processing} type="submit">
							Save
						</Button>
					</div>
				</div>
			</form>
		</div>
	);
}

export default ProjectForm;

const Checklist = ({ list, index, handleList }) => {
	return (
		<div className={styles.checklist_input}>
			<input
				type="checkbox"
				checked={list.isChecked}
				onChange={(e) => handleList(index, "check")}
			/>
			<textarea
				rows={1}
				value={list.description}
				onChange={(e) => handleList(index, "text", e.target.value)}
			/>
			<span onClick={() => handleList(index, "delete")}>
				<MdDelete />
			</span>
		</div>
	);
};
