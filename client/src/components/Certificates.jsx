import React from 'react';
import { Award, ExternalLink } from 'lucide-react';

const Certificates = () => {
  const certificates = [
    {
      id: 1,
      title: 'Latest Achievement',
      issuer: 'AWS',
      date: 'Nov 2024',
      icon: '☁️',
    },
    {
      id: 2,
      title: 'Latest Achievement',
      issuer: 'MongoDB',
      date: 'Oct 2024',
      icon: '🍃',
    },
  ];

  return (
    <div className="lg:col-span-1">
      <div className="bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-sm rounded-2xl p-6 border border-gray-800 hover:border-purple-500/50 transition-all duration-300 h-full">
        <div className="flex items-center gap-3 mb-6">
          <Award className="w-5 h-5 text-white" />
          <h3 className="text-xl font-bold text-white">My Certificates</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              className="group relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-4 hover:from-gray-800/70 hover:to-gray-900/70 transition-all duration-300 cursor-pointer border border-gray-700 hover:border-gray-600"
            >
              {/* Certificate Icon */}
              <div className="w-full aspect-[4/3] bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg flex items-center justify-center mb-3 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-orange-500/10"></div>
                <div className="relative z-10 text-center">
                  <div className="text-4xl mb-2">{cert.icon}</div>
                  <Award className="w-8 h-8 text-yellow-500 mx-auto" />
                </div>
                
                {/* Decorative corner borders */}
                <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-yellow-500/30"></div>
                <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-yellow-500/30"></div>
                <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-yellow-500/30"></div>
                <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-yellow-500/30"></div>
              </div>

              {/* Certificate Info */}
              <div className="space-y-1">
                <h4 className="text-white font-semibold text-sm">{cert.title}</h4>
                <p className="text-gray-400 text-xs">{cert.issuer}</p>
                <p className="text-gray-500 text-xs">{cert.date}</p>
              </div>

              {/* View Certificate Button */}
              <button className="mt-3 w-full py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1 group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-blue-600 group-hover:text-white">
                <span>View Certificate</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>

        <button className="w-full mt-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/50">
          View All Certificates
        </button>
      </div>
    </div>
  );
};

export default Certificates;
