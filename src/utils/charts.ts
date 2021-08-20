import { Chart } from 'chart.js';
import faker from 'faker';

// Helpers for generating random data if no database data is given to genData()
const dataLength = 20;
const rand = () => Math.round(Math.random() * 20 - 10);
const genLabels = () =>
  new Array(dataLength)
    .fill(null)
    .map(() => faker.date.between('2015-01-01T01:00:00Z', '2021-12-30T23:59:59Z').toISOString());

const genChartData = () => new Array(dataLength).fill(null).map(() => rand());

// Generates the data object for a chartJS chart
export const genData = (labels?: string[], chartData?: number[]) => ({
  labels: labels || genLabels(),
  datasets: [
    {
      label: 'Scale',
      fill: true,
      data: chartData || genChartData(),
      backgroundColor: ['rgba(255,255,255,0.04)'],
      borderColor: ['rgba(20, 184, 166, 1)'],
      borderWidth: 1,
      tension: 0.2,
    },
  ],
});

// Helper type for custom tooltip context
// https://www.chartjs.org/docs/latest/configuration/tooltip.html#tooltip-item-context
export type TooltipItemContext = {
  // The chart the tooltip is being shown on
  chart: Chart;

  // Label for the tooltip
  label: string;

  // Parsed data values for the given `dataIndex` and `datasetIndex`
  parsed: object;

  // Raw data values for the given `dataIndex` and `datasetIndex`
  raw: object;

  // Formatted value for the tooltip
  formattedValue: string;

  // The dataset the item comes from
  dataset: object;

  // Index of the dataset the item comes from
  datasetIndex: number;

  // Index of this data item in the dataset
  dataIndex: number;

  // The chart element (point, arc, bar, etc.) for this tooltip item
  element: Element;
};
