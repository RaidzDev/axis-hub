import React from 'react';
import { ArrowUpRight } from 'lucide-react';

const CategoryCard = ({ title, image, count }) => {
    return (
        <div className="group relative h-64 overflow-hidden rounded-2xl bg-gray-900 border border-gray-800 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/10 hover:border-blue-500/30">

            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-900/60 to-transparent z-10 transition-opacity duration-300 group-hover:opacity-90"></div>
                {/* Placeholder gradient if no image provided */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 group-hover:scale-105 transition-transform duration-700 ease-out"
                    style={{ backgroundImage: image ? `url(${image})` : 'linear-gradient(135deg, #1f2937, #111827)' }}></div>
            </div>

            {/* Content */}
            <div className="relative z-20 h-full flex flex-col justify-end p-6">
                <div className="flex items-end justify-between">
                    <div>
                        <span className="inline-block px-2 py-1 mb-2 text-xs font-semibold tracking-wider text-blue-400 uppercase bg-blue-500/10 rounded border border-blue-500/20 backdrop-blur-sm">
                            {count} Itens
                        </span>
                        <h3 className="text-xl font-bold text-white uppercase tracking-tight group-hover:text-blue-400 transition-colors">
                            {title}
                        </h3>
                    </div>

                    <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                        <ArrowUpRight size={20} />
                    </div>
                </div>
            </div>

            {/* Glow Effect on Hover */}
            <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-500/20 rounded-2xl pointer-events-none transition-colors duration-300"></div>
        </div>
    );
};

export default CategoryCard;
