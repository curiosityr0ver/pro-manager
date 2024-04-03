import {
	// useEffect,
	useState,
} from "react";
import styles from "./css/Projects.module.scss";
import { IoAdd } from "react-icons/io5";
// import { getTasksAnalytics } from "../apis/tasks";
import { useOutletContext } from "react-router-dom";
import Spinner from "../components/Spinner";
import { createProject } from "../apis/projects.js";
import ProjectForm from "../components/board/ProjectForm.jsx";

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
	const [tasksData, setTasksData] = useState({
		backlog: [],
		"to-do": [],
		progress: [],
		done: [],
	});
	const [newProject, setNewProject] = useState({
		title: "",
		description: "",
		admin: "",
		members: [],
	});
	const addTask = (task) => {
		setTasksData((prev) => ({ ...prev, "to-do": [...prev["to-do"], task] }));
	};

	const [loading, setLoading] = useState(false);
	const { notifyError, showPopupModal } = useOutletContext();

	const handleRemove = (index1, index2) => {
		const newMembers = analyticsData[index1].members;
		newMembers.splice(index2, 1);
		setAnalyticsData([...analyticsData]);
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
				<div
					className={styles.addProject}
					onClick={() => showPopupModal(ProjectForm, { addTask })}
				>
					<IoAdd />
				</div>
			</main>
		</div>
	) : (
		<Spinner />
	);
}

export default Projects;
