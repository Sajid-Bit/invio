import { useMemo } from 'react';
import { Transaction } from '../store/useStore';

interface SpendingChartProps {
    transactions: Transaction[];
    days?: number;
}

const SpendingChart = ({ transactions, days = 7 }: SpendingChartProps) => {
    const data = useMemo(() => {
        const today = new Date();
        const result = [];

        for (let i = days - 1; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];

            const dayTotal = transactions
                .filter(t =>
                    t.transaction_type === 'expense' &&
                    t.created_at.startsWith(dateStr)
                )
                .reduce((sum, t) => sum + t.amount, 0);

            result.push({
                date: date.toLocaleDateString('ar-EG', { weekday: 'short' }),
                amount: dayTotal,
                fullDate: dateStr
            });
        }
        return result;
    }, [transactions, days]);

    const maxAmount = Math.max(...data.map(d => d.amount), 1);
    const points = data.map((d, i) => {
        const x = (i / (data.length - 1)) * 100;
        const y = 100 - (d.amount / maxAmount) * 80; // Leave 20% padding at top
        return `${x},${y}`;
    }).join(' ');

    // Create area path (close the loop at the bottom)
    const areaPath = `${points} 100,100 0,100`;

    return (
        <div className="w-full h-full flex flex-col">
            <div className="flex-1 relative">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                    {/* Gradient Definition */}
                    <defs>
                        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="rgb(14, 165, 233)" stopOpacity="0.2" />
                            <stop offset="100%" stopColor="rgb(14, 165, 233)" stopOpacity="0" />
                        </linearGradient>
                    </defs>

                    {/* Grid Lines */}
                    <line x1="0" y1="20" x2="100" y2="20" stroke="#f3f4f6" strokeWidth="0.5" strokeDasharray="2" />
                    <line x1="0" y1="60" x2="100" y2="60" stroke="#f3f4f6" strokeWidth="0.5" strokeDasharray="2" />
                    <line x1="0" y1="100" x2="100" y2="100" stroke="#f3f4f6" strokeWidth="0.5" />

                    {/* Area Fill */}
                    <path
                        d={`M0,100 ${areaPath}`}
                        fill="url(#chartGradient)"
                        className="transition-all duration-500 ease-in-out"
                    />

                    {/* Line */}
                    <polyline
                        points={points}
                        fill="none"
                        stroke="rgb(14, 165, 233)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="transition-all duration-500 ease-in-out"
                    />

                    {/* Data Points */}
                    {data.map((d, i) => {
                        const x = (i / (data.length - 1)) * 100;
                        const y = 100 - (d.amount / maxAmount) * 80;
                        return (
                            <g key={i} className="group">
                                <circle
                                    cx={x}
                                    cy={y}
                                    r="1.5"
                                    className="fill-white stroke-primary-500 stroke-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                />
                                {/* Tooltip */}
                                <foreignObject x={x - 15} y={y - 25} width="30" height="20" className="opacity-0 group-hover:opacity-100 transition-opacity overflow-visible">
                                    <div className="bg-gray-800 text-white text-[8px] rounded px-1 py-0.5 text-center whitespace-nowrap transform -translate-x-1/2">
                                        {d.amount}
                                    </div>
                                </foreignObject>
                            </g>
                        );
                    })}
                </svg>
            </div>

            {/* X-Axis Labels */}
            <div className="flex justify-between mt-2 text-[10px] text-gray-400 font-medium px-1">
                {data.map((d, i) => (
                    <span key={i}>{d.date}</span>
                ))}
            </div>
        </div>
    );
};

export default SpendingChart;
