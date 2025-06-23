
const About = () => {
  return (
    <section id="about" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            About <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Me</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-400 to-purple-500 mx-auto rounded-full"></div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="w-80 h-80 mx-auto relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur-xl opacity-30"></div>
              <img
                src=""
                alt="Bharadwaj K"
                className="relative w-full h-full object-cover rounded-full border-4 border-slate-700 shadow-2xl"
              />
            </div>
          </div>
          
          <div className="space-y-6">
            <h3 className="text-2xl md:text-3xl font-semibold text-white">
              Passionate Developer & Problem Solver
            </h3>
            
            <p className="text-gray-300 leading-relaxed text-lg">
              With over 5 years of experience in web development, I specialize in creating 
              scalable, user-friendly applications using cutting-edge technologies. My journey 
              began with a curiosity for how things work, which evolved into a passion for 
              building digital solutions that make a real impact.
            </p>
            
            <p className="text-gray-300 leading-relaxed text-lg">
              I believe in writing clean, maintainable code and staying up-to-date with the 
              latest industry trends. When I'm not coding, you'll find me contributing to 
              open-source projects, mentoring junior developers, or exploring new technologies.
            </p>
            
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                <h4 className="font-semibold text-blue-400 mb-2">Experience</h4>
                <p className="text-gray-300">5+ Years</p>
              </div>
              <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                <h4 className="font-semibold text-blue-400 mb-2">Projects</h4>
                <p className="text-gray-300">50+ Completed</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
