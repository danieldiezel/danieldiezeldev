// Scroll-to-top
const scrollBtn = document.getElementById('scrollBtn');

window.addEventListener('scroll', () => {
  scrollBtn.classList.toggle('active', window.scrollY > 500);
});

scrollBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ─── ApexCharts global config ───
window.Apex = {
  chart: { foreColor: '#ccc', toolbar: { show: false } },
  stroke: { width: 3 },
  dataLabels: { enabled: false },
  tooltip: { theme: 'dark' },
  grid: { borderColor: '#2a2a2a', xaxis: { lines: { show: true } } },
};

// Sparkline: Stockstadt appearances per season
new ApexCharts(document.querySelector('#spark1'), {
  chart: {
    id: 'spark1',
    type: 'line',
    height: 100,
    sparkline: { enabled: true },
    dropShadow: { enabled: true, top: 1, left: 1, blur: 2, opacity: 0.2 },
  },
  series: [{ data: [6, 9, 12, 23, 42, 26, 12] }],
  stroke: { curve: 'smooth' },
  markers: { size: 0 },
  colors: ['#e82127'],
  grid: { padding: { top: 40, bottom: 10, left: 110 } },
  tooltip: { x: { show: false }, y: { title: { formatter: () => '' } } },
}).render();

// Sparkline: TuS Leider appearances per season
new ApexCharts(document.querySelector('#spark4'), {
  chart: {
    id: 'spark4',
    type: 'line',
    height: 100,
    sparkline: { enabled: true },
    dropShadow: { enabled: true, top: 1, left: 1, blur: 2, opacity: 0.2 },
  },
  series: [{ data: [7, 2, 6, 5, 1, 1, 7, 5, 10, 5, 3, 13, 11, 6, 14, 3, 7, 7] }],
  stroke: { curve: 'smooth' },
  markers: { size: 0 },
  colors: ['#e82127'],
  grid: { padding: { top: 40, bottom: 10, left: 110 } },
  tooltip: { x: { show: false }, y: { title: { formatter: () => '' } } },
}).render();

// Line chart: Goal contributions by year
new ApexCharts(document.querySelector('#line-adwords'), {
  chart: {
    height: 300,
    type: 'line',
    zoom: { enabled: false },
    dropShadow: { enabled: true, top: 3, left: 2, blur: 4, opacity: 1 },
    background: 'transparent',
  },
  stroke: { curve: 'smooth', width: 2 },
  colors: ['#e82127', '#4ade80'],
  series: [
    {
      name: 'Goals',
      data: [34, 38, 28, 21, 25, 20, 15, 12, 10, 7, 13, 6, 5, 8],
    },
    {
      name: 'Assists',
      data: [4, 2, 14, 11, 10, 11, 12, 5, 18, 18, 13, 11, 15, 8],
    },
  ],
  title: {
    text: 'Goal Contributions per Season',
    align: 'left',
    offsetY: 20,
    offsetX: 16,
    style: { fontSize: '13px', fontWeight: '600', color: '#f0f0f0', fontFamily: 'Inter' },
  },
  markers: { size: 4, strokeWidth: 0, hover: { size: 7 } },
  grid: { show: true, borderColor: '#2a2a2a', padding: { bottom: 0 } },
  labels: ['2008','2009','2010','2011','2012','2013','2014','2015','2016','2017','2018','2019','2020','2021'],
  xaxis: { tooltip: { enabled: false }, labels: { style: { colors: '#888', fontFamily: 'Inter' } } },
  yaxis: { labels: { style: { colors: '#888', fontFamily: 'Inter' } } },
  legend: {
    position: 'top',
    horizontalAlign: 'right',
    offsetY: -16,
    labels: { colors: '#ccc' },
    fontFamily: 'Inter',
  },
  theme: { mode: 'dark' },
}).render();
