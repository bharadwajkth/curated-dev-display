import { ArrowRight, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

const Hero = () => {
  const scrollToContact = () => {
    const element = document.querySelector("#contact");
    element?.scrollIntoView({ behavior: "smooth" });
  };

  const downloadCV = () => {
    // Create a link element and trigger download
    const link = document.createElement('a');
    link.href = '/cv/Bharadwaj_CV.pdf';
    link.download = 'Bharadwaj_CV.pdf';
    link.target = '_blank';
    
    // Append to body, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section id="home" className="min-h-screen flex items-center justify-center pt-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto text-center">
        <div className="animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="block text-white">Hi, I'm</span>
            <span className="block bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Bharadwaj
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-4 font-light">
            Passionate Web Developer
          </p>
          
          <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
            I craft beautiful, responsive web applications using modern technologies. 
            Passionate about creating exceptional user experiences and clean, efficient code.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              onClick={scrollToContact}
              size="lg"
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
            >
              Get In Touch
              <ArrowRight size={20} />
            </Button>
            
            <Button 
              onClick={downloadCV}
              variant="outline"
              size="lg"
              className="border-2 border-gray-400 text-gray-300 hover:bg-white hover:text-gray-900 font-semibold px-8 py-3 rounded-full transition-all duration-300 flex items-center gap-2"
            >
              Download CV
              <Download size={20} />
            </Button>
          </div>
        </div>
        
        <div className="mt-12 animate-bounce">
          <div className="w-6 h-10 border-2 border-gray-400 rounded-full mx-auto flex justify-center">
            <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;