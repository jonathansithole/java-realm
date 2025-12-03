import React, { useEffect, useRef } from 'react';
import { Puzzle } from '../types.ts';
import * as d3 from 'd3';
import { User, Zap, Lock, ArrowDown, Cpu } from 'lucide-react';

interface VisualizerProps {
  puzzle: Puzzle;
  isSolved: boolean;
  isSolving: boolean; // Animation state
}

const Visualizer: React.FC<VisualizerProps> = ({ puzzle, isSolved, isSolving }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // D3 Reactor Pulse Effect
  useEffect(() => {
    if (puzzle.visualType === 'reactor' && svgRef.current) {
      const svg = d3.select(svgRef.current);
      svg.selectAll("*").remove();

      const width = containerRef.current?.clientWidth || 400;
      const height = containerRef.current?.clientHeight || 400;

      const g = svg.append("g")
        .attr("transform", `translate(${width / 2}, ${height / 2})`);

      // Core
      g.append("circle")
        .attr("r", 30)
        .attr("fill", isSolved ? "#06b6d4" : "#ef4444") // Cyan if solved, Red if not
        .attr("class", isSolved ? "animate-pulse" : "");

      // Rings
      const rings = [50, 80, 110];
      rings.forEach((r, i) => {
        g.append("circle")
          .attr("r", r)
          .attr("fill", "none")
          .attr("stroke", isSolved ? "#06b6d4" : "#7f1d1d")
          .attr("stroke-width", 2)
          .attr("opacity", 0.5)
          .transition()
          .duration(isSolved ? 1000 : 200) // Calm vs Chaotic
          .ease(d3.easeLinear)
          .attrTween("r", () => {
             return (t: number) => (r + (isSolved ? t * 10 : Math.random() * 10)).toString();
          })
          .style("opacity", 0)
          .on("end", functionRepeat);
        
        function functionRepeat(this: any) {
            if(isSolved) {
                d3.select(this)
                .attr("r", r)
                .style("opacity", 0.5)
                .transition()
                .duration(2000)
                .attr("r", r + 40)
                .style("opacity", 0)
                .on("end", functionRepeat);
            }
        }
      });
    }
  }, [puzzle, isSolved]);

  return (
    <div ref={containerRef} className="w-full h-full bg-black relative overflow-hidden flex items-center justify-center">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.1)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      
      {/* Puzzle Specific Visuals */}
      
      {/* 1. CONVEYOR */}
      {puzzle.visualType === 'conveyor' && (
        <div className="relative w-full max-w-md h-32 border-b-4 border-cyan-900 flex items-end overflow-hidden">
           {/* Conveyor Belt Animation */}
           <div className={`absolute bottom-0 left-0 w-[200%] h-2 bg-[repeating-linear-gradient(90deg,transparent,transparent_20px,#06b6d4_20px,#06b6d4_40px)] ${isSolved ? 'animate-[slideRight_1s_linear_infinite]' : ''} opacity-50`}></div>
           
           {/* Explorer */}
           <div className={`transition-all duration-1000 ease-in-out ${isSolved ? 'translate-x-[300px]' : 'translate-x-10'}`}>
              <div className="flex flex-col items-center">
                <User className={`w-12 h-12 ${isSolved ? 'text-cyan-400' : 'text-yellow-500 animate-bounce'}`} />
                <div className="w-8 h-1 bg-cyan-500/50 rounded-full blur-sm"></div>
              </div>
           </div>
           {/* Goal */}
           <div className="absolute right-10 bottom-4">
             <div className="w-8 h-32 bg-cyan-900/30 border border-cyan-500/50 animate-pulse flex items-end justify-center">
                <span className="text-xs text-cyan-400 mb-2">EXIT</span>
             </div>
           </div>
        </div>
      )}

      {/* 2. PATTERN DOOR */}
      {puzzle.visualType === 'door' && (
        <div className="flex gap-4">
           {[1, 2, 3, 4].map((doorId) => (
             <div key={doorId} className={`w-20 h-40 border-2 rounded transition-all duration-500 flex flex-col items-center justify-center gap-2
                ${isSolved 
                  ? 'border-cyan-500 bg-cyan-900/20 shadow-[0_0_20px_rgba(6,182,212,0.3)]' 
                  : 'border-red-900 bg-red-950/20'
                }`}>
                 {isSolved ? <div className="text-cyan-400 font-bold text-xl">OPEN</div> : <Lock className="text-red-500" />}
                 <div className="flex gap-1">
                   {Array.from({ length: doorId }).map((_, i) => (
                     <div key={i} className={`w-1 h-1 rounded-full ${isSolved ? 'bg-cyan-400' : 'bg-red-800'}`}></div>
                   ))}
                 </div>
             </div>
           ))}
        </div>
      )}

      {/* 3. LASER GRID */}
      {puzzle.visualType === 'laser' && (
        <div className="relative w-64 h-64 border border-gray-800 rounded-lg bg-gray-900/50 flex items-center justify-center">
            <User className="w-8 h-8 text-cyan-400 relative z-10" />
            {/* Lasers */}
            <div className={`absolute inset-0 transition-opacity duration-1000 ${isSolved ? 'opacity-0' : 'opacity-100'}`}>
              {/* Horizontal Beams */}
              {[1,2,3,4,5].map(i => (
                 <div key={`h-${i}`} className="absolute w-full h-[2px] bg-red-500 shadow-[0_0_10px_red]" style={{ top: `${i * 20}%` }}></div>
              ))}
               {/* Vertical Beams */}
               {[1,2,3,4,5].map(i => (
                 <div key={`v-${i}`} className="absolute h-full w-[2px] bg-red-500 shadow-[0_0_10px_red]" style={{ left: `${i * 20}%` }}></div>
              ))}
            </div>
            {isSolved && <span className="absolute -top-10 text-cyan-400 font-bold">GRID DISABLED</span>}
        </div>
      )}

      {/* 4. BRIDGE */}
      {puzzle.visualType === 'bridge' && (
        <div className="relative w-64 h-96 border-r border-gray-800 flex flex-col items-center p-4">
           <div className="absolute top-0 left-0 w-full p-2 text-center text-gray-500 text-xs">HEIGHT: 5</div>
           <div className="absolute bottom-0 left-0 w-full p-2 text-center text-gray-500 text-xs">HEIGHT: 0</div>
           
           <div className="flex flex-col gap-2 w-full h-full justify-between py-8">
              {[5, 4, 3, 2, 1].map((tile, index) => (
                <div 
                  key={tile} 
                  className={`w-full h-10 rounded border transition-all duration-500
                    ${isSolved 
                      ? `bg-cyan-500/30 border-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.4)] delay-[${index * 200}ms] opacity-100 translate-x-0`
                      : 'bg-transparent border-dashed border-gray-700 opacity-20 translate-x-4'
                    }`}
                >
                  {isSolved && <ArrowDown className="w-4 h-4 text-cyan-400 mx-auto mt-2 animate-bounce" />}
                </div>
              ))}
           </div>
        </div>
      )}

      {/* 5. REACTOR CORE */}
      {puzzle.visualType === 'reactor' && (
        <div className="w-full h-full relative">
           <svg ref={svgRef} className="w-full h-full absolute inset-0"></svg>
           <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
             <Cpu className={`w-16 h-16 transition-colors duration-1000 ${isSolved ? 'text-white drop-shadow-[0_0_15px_cyan]' : 'text-red-500 animate-pulse'}`} />
           </div>
           <div className="absolute bottom-10 w-full text-center">
              <h2 className={`text-2xl font-bold tracking-widest ${isSolved ? 'text-cyan-400' : 'text-red-500'}`}>
                 {isSolved ? "REACTOR STABILIZED" : "CRITICAL ERROR"}
              </h2>
           </div>
        </div>
      )}

      {/* CSS for Keyframes if needed */}
      <style>{`
        @keyframes slideRight {
          0% { transform: translateX(0); }
          100% { transform: translateX(-20px); } /* Move texture left to look like moving right */
        }
      `}</style>
    </div>
  );
};

export default Visualizer;