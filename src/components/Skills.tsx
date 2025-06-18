
const Skills = () => {
  const skillCategories = [
    {
      title: "Frontend",
      skills: [
        { name: "React", level: 95, color: "from-blue-400 to-blue-600" },
        { name: "TypeScript", level: 90, color: "from-blue-500 to-blue-700" },
        { name: "Next.js", level: 85, color: "from-gray-400 to-gray-600" },
        { name: "Tailwind CSS", level: 90, color: "from-cyan-400 to-cyan-600" },
      ]
    },
    {
      title: "Backend",
      skills: [
        { name: "Node.js", level: 85, color: "from-green-400 to-green-600" },
        { name: "Express", level: 80, color: "from-gray-400 to-gray-600" },
        { name: "PostgreSQL", level: 75, color: "from-blue-400 to-blue-600" },
        { name: "MongoDB", level: 70, color: "from-green-400 to-green-600" },
      ]
    },
    {
      title: "Tools & Others",
      skills: [
        { name: "Git", level: 90, color: "from-orange-400 to-orange-600" },
        { name: "Docker", level: 75, color: "from-blue-400 to-blue-600" },
        { name: "AWS", level: 70, color: "from-yellow-400 to-yellow-600" },
        { name: "Figma", level: 80, color: "from-purple-400 to-purple-600" },
      ]
    }
  ];

  return (
    <section id="skills" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Technical <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Skills</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-400 to-purple-500 mx-auto rounded-full"></div>
          <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
            Here are the technologies and tools I work with to bring ideas to life
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {skillCategories.map((category, categoryIndex) => (
            <div key={categoryIndex} className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 hover:border-slate-600 transition-colors duration-300">
              <h3 className="text-xl font-semibold mb-6 text-center text-white">
                {category.title}
              </h3>
              
              <div className="space-y-4">
                {category.skills.map((skill, skillIndex) => (
                  <div key={skillIndex} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300 font-medium">{skill.name}</span>
                      <span className="text-gray-400 text-sm">{skill.level}%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div 
                        className={`bg-gradient-to-r ${skill.color} h-2 rounded-full transition-all duration-1000 ease-out`}
                        style={{ width: `${skill.level}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
