import React, { useState } from 'react';
import { Award, X, Calendar, Building, Trophy as TrophyIcon } from 'lucide-react';

const Shelf = () => {
  const [selectedItem, setSelectedItem] = useState(null);

  const certificates = [
    {
      id: 1,
      type: 'certificate',
      title: 'AWS Certified Solutions Architect',
      platform: 'Amazon Web Services',
      issuedDate: 'July 15, 2024',
      badgeIcon: '☁️',
      description: 'Professional certification demonstrating expertise in designing distributed systems on AWS.',
      imageUrl: null, // placeholder for certificate image
      frameBg: 'from-gray-700 to-gray-900',
    },
    {
      id: 2,
      type: 'certificate',
      title: 'Google Cloud Professional',
      platform: 'Google Cloud',
      issuedDate: 'June 10, 2024',
      badgeIcon: '🔷',
      description: 'Advanced certification in Google Cloud Platform architecture and services.',
      imageUrl: null,
      frameBg: 'from-blue-900 to-gray-800',
    },
    {
      id: 3,
      type: 'certificate',
      title: 'AWS Certified Developer',
      platform: 'Amazon Web Services',
      issuedDate: 'May 20, 2024',
      badgeIcon: '⚙️',
      description: 'Certification validating technical expertise in developing applications on AWS.',
      imageUrl: null,
      frameBg: 'from-gray-700 to-gray-900',
    },
  ];

  const trophies = [
    {
      id: 4,
      type: 'trophy',
      title: 'HackerRank Gold Badge',
      platform: 'HackerRank',
      issuedDate: 'August 1, 2024',
      badgeIcon: '🥇',
      description: 'Achieved gold level proficiency in problem solving and algorithms.',
      color: 'text-yellow-500',
    },
    {
      id: 5,
      type: 'trophy',
      title: 'LeetCode 500 Problems',
      platform: 'LeetCode',
      issuedDate: 'July 25, 2024',
      badgeIcon: '💎',
      description: 'Completed 500+ coding challenges across multiple difficulty levels.',
      color: 'text-cyan-400',
    },
    {
      id: 6,
      type: 'trophy',
      title: 'GitHub Star Contributor',
      platform: 'GitHub',
      issuedDate: 'June 5, 2024',
      badgeIcon: '⭐',
      description: 'Recognition for outstanding contributions to open source projects.',
      color: 'text-yellow-400',
    },
    {
      id: 7,
      type: 'trophy',
      title: 'Code Champion',
      platform: 'CodeForces',
      issuedDate: 'May 15, 2024',
      badgeIcon: '🏆',
      description: 'Top performer in competitive programming contests.',
      color: 'text-orange-500',
    },
    {
      id: 8,
      type: 'trophy',
      title: 'Master Coder',
      platform: 'Codewars',
      issuedDate: 'April 10, 2024',
      badgeIcon: '🎯',
      description: 'Reached master level in coding kata challenges.',
      color: 'text-red-500',
    },
    {
      id: 9,
      type: 'trophy',
      title: 'SQL Expert',
      platform: 'DataCamp',
      issuedDate: 'March 20, 2024',
      badgeIcon: '🔵',
      description: 'Demonstrated advanced SQL query optimization skills.',
      color: 'text-blue-500',
    },
  ];

  const allItems = [...certificates, ...trophies];

  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  const closeModal = () => {
    setSelectedItem(null);
  };

  return (
    <div className="mb-8">
      <div className="relative bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-sm rounded-2xl p-8 border border-gray-800">
        {/* Top Shelf - Certificates */}
        <div className="mb-12">
          <div className="flex justify-center gap-6 mb-6 perspective-1000">
            {certificates.map((cert, i) => (
              <div
                key={cert.id}
                onClick={() => handleItemClick(cert)}
                className="relative cursor-pointer transform hover:scale-105 transition-all duration-300 hover:-translate-y-2 group"
                style={{
                  transform: `rotateY(${(i - 1) * 5}deg)`,
                  transformStyle: 'preserve-3d',
                }}
              >
                {/* Certificate Frame */}
                <div className={`w-28 h-36 bg-gradient-to-br ${cert.frameBg} rounded-lg border-4 border-gray-600 shadow-2xl relative overflow-hidden`}>
                  {/* Frame shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                  
                  {/* Certificate content */}
                  <div className="absolute inset-2 bg-gray-200 rounded flex flex-col items-center justify-center p-2">
                    <div className="text-3xl mb-2">{cert.badgeIcon}</div>
                    <div className="text-[8px] text-gray-800 text-center font-bold leading-tight">
                      {cert.title.split(' ').slice(0, 2).join(' ')}
                    </div>
                    <div className="mt-1 text-[6px] text-gray-600">{cert.platform.split(' ')[0]}</div>
                  </div>

                  {/* Glow effect on hover */}
                  <div className="absolute inset-0 bg-purple-500/0 group-hover:bg-purple-500/20 transition-all duration-300 rounded"></div>
                </div>

                {/* Certificate shadow */}
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-3 bg-black/50 blur-md rounded-full"></div>
              </div>
            ))}
          </div>

          {/* Top Shelf Platform */}
          <div className="relative">
            <div className="h-4 bg-gradient-to-r from-purple-600 via-purple-500 to-blue-500 rounded-t-xl shadow-lg shadow-purple-500/50"></div>
            <div className="h-10 bg-gradient-to-b from-gray-800 to-gray-900 border-x-4 border-b-4 border-gray-700 rounded-b-xl"></div>
            <div className="h-2 bg-gradient-to-b from-black/50 to-transparent rounded-full blur-sm mt-1"></div>
          </div>
        </div>

        {/* Bottom Shelf - Trophies and Badges */}
        <div>
          <div className="relative mb-6">
            {/* Shelf Platform */}
            <div className="h-4 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 rounded-t-xl shadow-lg shadow-cyan-500/50"></div>
            <div className="h-10 bg-gradient-to-b from-gray-800 to-gray-900 border-x-4 border-b-4 border-gray-700 rounded-b-xl"></div>

            {/* Trophies and badges on shelf */}
            <div className="absolute -top-6 left-0 right-0 flex justify-center gap-4 px-8">
              {trophies.map((trophy) => (
                <div
                  key={trophy.id}
                  onClick={() => handleItemClick(trophy)}
                  className="cursor-pointer transform hover:scale-125 transition-all duration-300 hover:-translate-y-3 group"
                >
                  <div className={`text-4xl ${trophy.color} filter drop-shadow-2xl`}>
                    {trophy.badgeIcon}
                  </div>
                  {/* Trophy glow effect */}
                  <div className="absolute inset-0 bg-yellow-500/0 group-hover:bg-yellow-500/30 blur-xl rounded-full transition-all duration-300"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Shadow under shelf */}
          <div className="h-2 bg-gradient-to-b from-black/50 to-transparent rounded-full blur-sm"></div>
        </div>
      </div>

      {/* Modal Popup */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={closeModal}>
          <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-700 rounded-2xl max-w-2xl w-full p-8 relative shadow-2xl" onClick={(e) => e.stopPropagation()}>
            {/* Close button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Modal content */}
            <div className="text-center mb-6">
              <div className="text-6xl mb-4 inline-block">{selectedItem.badgeIcon}</div>
              <h2 className="text-3xl font-bold text-white mb-2">{selectedItem.title}</h2>
              <p className="text-gray-400 text-lg">{selectedItem.description}</p>
            </div>

            {/* Certificate/Trophy Details */}
            <div className="space-y-4 bg-gray-800/50 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center gap-3">
                <Building className="w-5 h-5 text-purple-500" />
                <div>
                  <div className="text-xs text-gray-500">Platform</div>
                  <div className="text-white font-semibold">{selectedItem.platform}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-blue-500" />
                <div>
                  <div className="text-xs text-gray-500">Issued Date</div>
                  <div className="text-white font-semibold">{selectedItem.issuedDate}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {selectedItem.type === 'certificate' ? (
                  <Award className="w-5 h-5 text-yellow-500" />
                ) : (
                  <TrophyIcon className="w-5 h-5 text-yellow-500" />
                )}
                <div>
                  <div className="text-xs text-gray-500">Type</div>
                  <div className="text-white font-semibold capitalize">{selectedItem.type}</div>
                </div>
              </div>
            </div>

            {/* Certificate Image Placeholder */}
            {selectedItem.type === 'certificate' && (
              <div className="mt-6 bg-gray-800/30 rounded-xl p-8 border border-gray-700 border-dashed">
                <div className="text-center text-gray-500">
                  <Award className="w-16 h-16 mx-auto mb-2 text-gray-600" />
                  <p className="text-sm">Certificate Image</p>
                </div>
              </div>
            )}

            {/* Action button */}
            <button className="w-full mt-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/50">
              View Full Certificate
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Shelf;
