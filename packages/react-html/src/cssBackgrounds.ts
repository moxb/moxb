import { Property as CSSProperty } from 'csstype';

type Color = CSSProperty.Color;

type GradientInputDataPoint = [Color, string];

type GradientInput = GradientInputDataPoint[];

export const getCSSLinearGradientString = (input: GradientInput): string =>
    'linear-gradient(' + ['to right', ...input.map((dataPoint) => `${dataPoint[0]} ${dataPoint[1]}`)].join(', ') + ')';

type IntervalInputDataPoint = [number, number, Color];

export interface IntervalColoringInput {
    min: number;
    max: number;
    bgColor: Color;
    intervals: IntervalInputDataPoint[];
}

export const getCSSBackgroundForIntervals = (input: IntervalColoringInput): string => {
    const { min, bgColor, max, intervals } = input;

    const getPosition = (pos: number): string => {
        if (pos < min || pos > max) {
            throw new Error(`"Position is supposed to be [${min},${max}]; received ${pos}`);
        }
        return `${Math.round((10000 * (pos - min)) / (max - min)) / 100}%`;
    };

    const gradients: GradientInputDataPoint[] = [];

    let nextInterval = intervals[0];

    if (nextInterval) {
        let nextStart = nextInterval[0];
        let nextStartPos = getPosition(nextStart);
        let nextColor = nextInterval[2];

        // Do we have an empty space right at the beginning?
        const startWithEmptiness = nextStart !== min;

        if (startWithEmptiness) {
            gradients.push([bgColor, '0%']);
            gradients.push([bgColor, nextStartPos]);
        }
        gradients.push([nextColor, nextStartPos]);
        intervals.forEach((i, index) => {
            const currentEnd = i[1];
            const currentEndPosition = getPosition(currentEnd);
            const currentColor = i[2];
            const isLastInterval = index === intervals.length - 1;
            if (isLastInterval) {
                const endsWithEmptiness = currentEnd !== max;
                if (endsWithEmptiness) {
                    gradients.push([currentColor, currentEndPosition]);
                    gradients.push([bgColor, currentEndPosition]);
                    gradients.push([bgColor, '100%']);
                } else {
                    gradients.push([currentColor, '100%']);
                }
            } else {
                nextInterval = intervals[index + 1]!;
                nextStart = nextInterval[0];
                nextStartPos = getPosition(nextStart);
                nextColor = nextInterval[2];
                const touchesNext = nextStart === currentEnd;
                gradients.push([currentColor, currentEndPosition]);
                if (touchesNext) {
                    gradients.push([nextColor, currentEndPosition]);
                } else {
                    gradients.push([bgColor, currentEndPosition]);
                    gradients.push([bgColor, nextStartPos]);
                    gradients.push([nextColor, nextStartPos]);
                }
            }
        });
    } else {
        gradients.push([bgColor, '0%']);
        gradients.push([bgColor, '100%']);
    }

    return getCSSLinearGradientString(gradients);
};
