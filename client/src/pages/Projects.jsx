import {
	// useEffect,
	useState,
} from "react";
import styles from "./css/Projects.module.scss";
// import { getTasksAnalytics } from "../apis/tasks";
import { useOutletContext } from "react-router-dom";
import Spinner from "../components/Spinner";
import { createProject } from "../apis/projects.js";

const analyticsGroup = [
	{
		title: "Backlog Tasks",
		description:
			"Welcome to our pizza project, where every slice tells a story of flavor and craftsmanship! We are passionate about crafting the perfect pie, from hand-kneaded dough to locally sourced toppings, each ingredient is selected with care to ensure a mouthwatering experience with every bite.",
		members: ["abc@xyz.com", "ombg@yahoo.in", "nobita@gian.com"],
		admin: "sabkaboss@gmail.com",
		dataIndex: "backlog",
	},
];

function Projects() {
	const [analyticsData, setAnalyticsData] = useState([...analyticsGroup]);
	const [member, setMember] = useState();
	const [newProject, setNewProject] = useState({
		title: "",
		description: "",
		admin: "",
		members: [],
	});

	const [loading, setLoading] = useState(false);
	const { notifyError } = useOutletContext();
	const [currentInput, setCurrentInput] = useState();

	const handleRemove = (index1, index2) => {
		const newMembers = analyticsData[index1].members;
		newMembers.splice(index2, 1);
		setAnalyticsData([...analyticsData]);
	};
	const handleNewProjectSubmit = async () => {
		const { data: newProject, error } = await createProject({ ...newProject });
		if (error) {
			notifyError("Can't Add Project, Try Again!");
			setLoading(false);
			return;
		} else {
			console.log(newProject);
		}
		setNewProject({
			title: "",
			description: "",
			admin: "",
			members: [],
		});
	};
	// useEffect(() => {
	// 	(async () => {
	// 		const { data: analytics, error } = await getTasksAnalytics();
	// 		if (error) {
	// 			notifyError("Something went wrong");
	// 			setLoading(false);
	// 			return;
	// 		}

	// 		setAnalyticsData(analytics);
	// 		setLoading(false);
	// 	})();
	// }, []);

	return !loading ? (
		<div className={styles.analytics}>
			<h3>Projects</h3>
			<main>
				{analyticsData.map((group, index1) => (
					<div key={index1} className={styles.data}>
						<h1>{group.title}</h1>
						<p>{group.description}</p>
						<div>
							<p id={styles.admin}>
								<span id={styles.admin}>&bull;</span> {group.admin}
							</p>
						</div>
						{group.members.map((email, index2) => (
							<div key={index2}>
								<p>
									<span>&bull;</span> {email}
								</p>
								<h3 onClick={() => handleRemove(index1, index2)}>x</h3>
							</div>
						))}
					</div>
				))}
				<div className={styles.data}>
					{currentInput != 1 && (
						<h1 onClick={() => setCurrentInput(1)}>Enter Title</h1>
					)}
					{currentInput == 1 && (
						<input
							className={styles.title}
							value={newProject.title}
							onChange={(e) => {
								newProject.title = e.target.value;
								setNewProject({ ...newProject });
							}}
							type="text"
							placeholder="Title"
						/>
					)}
					{currentInput != 2 && (
						<h1 onClick={() => setCurrentInput(2)}>Enter Description</h1>
					)}
					<br />
					{currentInput == 2 && (
						<input
							className={styles.description}
							value={newProject.description}
							onChange={(e) => {
								newProject.description = e.target.value;
								setNewProject({ ...newProject });
							}}
							type="text"
							placeholder="Description"
						/>
					)}
					<input
						className={styles.admin}
						value={newProject.admin}
						onChange={(e) => {
							newProject.admin = e.target.value;
							setNewProject({ ...newProject });
						}}
						type="email"
						placeholder="admin"
					/>
					<div style={{ justifyContent: "normal" }}>
						<input
							className={styles.member}
							value={member}
							onChange={(e) => {
								setMember(e.target.value);
							}}
							type="text"
							placeholder="add members"
						/>

						<h3
							onClick={() => {
								newProject.members.push(member);
								setNewProject({ ...newProject });
								setMember("");
							}}
						>
							✔
						</h3>
					</div>
					<div>
						<button
							className={styles.submitProject}
							onClick={() => handleNewProjectSubmit}
						>
							Add Project
						</button>
					</div>
				</div>
			</main>
		</div>
	) : (
		<Spinner />
	);
}

export default Projects;
