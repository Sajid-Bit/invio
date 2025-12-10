import { useMemo } from 'react';

interface CategoryDonutProps {
    data: [string, number][];
    total: number;
}

const CategoryDonut = ({ data, total }: CategoryDonutProps) => {
    const chartData = useMemo(() => {
        let cumulativePercent = 0;
        return data.map(([category, amount], index) => {
            const percent = (amount / total) * 100;
            const start = cumulativePercent;
            cumulativePercent += percent;

            // Colors matching the Reports page
            const colors = [
                'text-primary-500',
                'text-secondary-500',
                'text-accent-500',
                'text-purple-500',
                'text-pink-500'
            ];

            return {
                category,
                amount,
                percent,
                start,
                color: colors[index % colors.length]
            };
        });
    }, [data, total]);

    // Helper to calculate SVG arc path
    const getCoordinatesForPercent = (percent: number) => {
        const x = Math.cos(2 * Math.PI * percent);
        const y = Math.sin(2 * Math.PI * percent);
        return [x, y];
    };

    return (
        <div className="relative w-48 h-48 mx-auto">
            <svg viewBox="-1 -1 2 2" className="transform -rotate-90 w-full h-full">
                {chartData.map((slice, i) => {
                    const startAngle = slice.start / 100;
                    const endAngle = (slice.start + slice.percent) / 100;

                    const [startX, startY] = getCoordinatesForPercent(startAngle);
                    const [endX, endY] = getCoordinatesForPercent(endAngle);

                    const largeArcFlag = slice.percent > 50 ? 1 : 0;

                    const pathData = [
                        `M ${startX} ${startY}`,
                        `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`,
                        `L 0 0`,
                    ].join(' ');

                    return (
                        <path
                            key={i}
                            d={pathData}
                            className={`${slice.color} fill-current transition-all duration-300 hover:opacity-80 cursor-pointer stroke-white stroke-[0.02]`}
                        />
                    );
                })}
                {/* Inner Circle for Donut Effect */}
                <circle cx="0" cy="0" r="0.7" className="fill-white" />
            </svg>

            {/* Center Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xs text-gray-400 font-medium">الإجمالي</span>
                <span className="text-lg font-bold text-gray-800">
                    {total.toLocaleString('ar-EG', { notation: 'compact' })}
                </span>
            </div>
        </div>
    );
};

export default CategoryDonut;
