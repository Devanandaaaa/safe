const skills = [
    { name: "Web Development", link: "discord_link_here" },
    { name: "Graphic Design", link: "discord_link_here" },
    { name: "Digital Marketing", link: "discord_link_here" }
];

const jobs = [
    { title: "Junior Web Developer", company: "Startup", type: "Remote" },
    { title: "Graphic Designer Intern", company: "Agency", type: "Hybrid" }
];

export default function FinancialPage() {
    return (
        <div className="p-10 max-w-6xl mx-auto space-y-12">

            {/* Page Title */}
            <h1 className="text-4xl font-bold text-center text-purple-700">
                Financial Independence Hub
            </h1>

            {/* SKILL DEVELOPMENT SECTION */}
            <section>
                <h2 className="text-3xl font-semibold mb-5">
                    Learn Skills & Join Communities
                </h2>

                <input
                    className="w-full p-3 border rounded mb-5"
                    placeholder="Search skill..."
                />

                <div className="grid md:grid-cols-3 gap-4">
                    {skills.map((skill, i) => (
                        <div key={i} className="p-5 bg-white shadow rounded">
                            <h3 className="text-xl font-semibold mb-2">{skill.name}</h3>
                            <a
                                href={skill.link}
                                className="text-blue-600 hover:underline"
                                target="_blank"
                            >
                                Join Discord Community
                            </a>
                        </div>
                    ))}
                </div>
            </section>

            {/* JOB OPPORTUNITY SECTION */}
            <section>
                <h2 className="text-3xl font-semibold mb-5">
                    Job Opportunities
                </h2>

                <div className="grid md:grid-cols-2 gap-4">
                    {jobs.map((job, i) => (
                        <div key={i} className="p-5 bg-white shadow rounded">
                            <h3 className="text-xl font-semibold">{job.title}</h3>
                            <p className="text-gray-600">{job.company}</p>
                            <p className="text-green-600">{job.type}</p>

                            <button className="mt-3 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">
                                Apply
                            </button>
                        </div>
                    ))}
                </div>
            </section>

        </div>
    );
}
