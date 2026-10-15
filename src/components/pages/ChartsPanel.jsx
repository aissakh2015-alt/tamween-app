import {
  LineChart, Line,
  BarChart, Bar,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { Icon } from '../ui/Icon';

/* ═══════════════════════════════════════════════════════
 *  Colors Palette
 * ═══════════════════════════════════════════════════════ */
const COLORS = {
  red:     '#e74c3c',
  orange:  '#f39c12',
  blue:    '#3498db',
  green:   '#27ae60',
  purple:  '#9b59b6',
  teal:    '#1abc9c',
  slate:   '#64748b',
};

/* ═══════════════════════════════════════════════════════
 *  Tooltip مخصص (عربي)
 * ═══════════════════════════════════════════════════════ */
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="bg-white border-2 border-slate-200 rounded-xl shadow-lg px-4 py-3 text-sm">
      <div className="font-bold text-slate-800 mb-1.5">{label}</div>
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-2 text-slate-600">
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: entry.color }} />
          <span>{entry.name}:</span>
          <span className="font-bold text-slate-800">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════
 *  المكوّن الرئيسي
 * ═══════════════════════════════════════════════════════ */
export default function ChartsPanel({ requirements, orders, stock }) {
  /* ─── بيانات 1: تطور الطلبيات (آخر 6 أسابيع) ─── */
  const weeklyData = [
    { week: 'أسبوع 1', طلبيات: 3, احتياجات: 5 },
    { week: 'أسبوع 2', طلبيات: 5, احتياجات: 4 },
    { week: 'أسبوع 3', طلبيات: 4, احتياجات: 6 },
    { week: 'أسبوع 4', طلبيات: 7, احتياجات: 3 },
    { week: 'أسبوع 5', طلبيات: 6, احتياجات: 5 },
    { week: 'أسبوع 6', طلبيات: 8, احتياجات: 4 },
  ];

  /* ─── بيانات 2: توزيع الاحتياجات حسب النوع ─── */
  const typeCounts = {};
  requirements.forEach((r) => {
    typeCounts[r.type] = (typeCounts[r.type] || 0) + 1;
  });
  const pieData = Object.entries(typeCounts).map(([name, value]) => ({
    name,
    value,
  }));
  const PIE_COLORS = [COLORS.blue, COLORS.orange, COLORS.green, COLORS.purple, COLORS.teal, COLORS.red];

  /* ─── بيانات 3: مقارنة الفئات (مخزون / حد أدنى) ─── */
  const stockByType = {};
  stock.forEach((s) => {
    if (!stockByType[s.type]) stockByType[s.type] = { type: s.type, الحالي: 0, الحدالأدنى: 0 };
    stockByType[s.type].الحالي += s.current;
    stockByType[s.type].الحدالأدنى += s.min;
  });
  const barData = Object.values(stockByType);

  return (
    <div className="space-y-5">

      {/* ═══════════════════════════════════════════════
       *  الصف الأول: Line Chart + Pie Chart
       * ═══════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* 📈 خطي: تطور الطلبيات والاحتياجات */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Icon.Chart width="20" height="20" className="text-blue-600" />
              تطور الطلبيات والاحتياجات
            </h3>
            <span className="text-xs text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
              آخر 6 أسابيع
            </span>
          </div>

          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={weeklyData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="4 4" stroke="#e2e8f0" />
              <XAxis
                dataKey="week"
                tick={{ fontSize: 12, fill: '#64748b', fontFamily: 'Cairo' }}
                axisLine={{ stroke: '#cbd5e1' }}
              />
              <YAxis
                tick={{ fontSize: 12, fill: '#64748b' }}
                axisLine={{ stroke: '#cbd5e1' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ fontFamily: 'Cairo', fontSize: '13px', paddingTop: '10px' }}
                iconType="circle"
              />
              <Line
                type="monotone"
                dataKey="طلبيات"
                stroke={COLORS.green}
                strokeWidth={3}
                dot={{ r: 5, fill: COLORS.green, strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 7 }}
              />
              <Line
                type="monotone"
                dataKey="احتياجات"
                stroke={COLORS.orange}
                strokeWidth={3}
                dot={{ r: 5, fill: COLORS.orange, strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* 🍩 دائري: توزيع الاحتياجات */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Icon.Package width="20" height="20" className="text-purple-600" />
            الاحتياجات حسب النوع
          </h3>

          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={90}
                paddingAngle={3}
                dataKey="value"
                label={({ name, value }) => `${name} (${value})`}
                labelLine={{ stroke: '#cbd5e1' }}
                style={{ fontFamily: 'Cairo', fontSize: '12px' }}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════
       *  الصف الثاني: Bar Chart (مقارنة الفئات)
       * ═══════════════════════════════════════════════ */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Icon.Warehouse width="20" height="20" className="text-emerald-600" />
            مقارنة المخزون الحالي بالحد الأدنى
          </h3>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded" style={{ background: COLORS.blue }} />
              الحالي
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded" style={{ background: COLORS.red }} />
              الحد الأدنى
            </span>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={barData}
            margin={{ top: 10, right: 10, left: -10, bottom: 5 }}
            barCategoryGap="25%"
          >
            <CartesianGrid strokeDasharray="4 4" stroke="#e2e8f0" vertical={false} />
            <XAxis
              dataKey="type"
              tick={{ fontSize: 13, fill: '#64748b', fontFamily: 'Cairo' }}
              axisLine={{ stroke: '#cbd5e1' }}
            />
            <YAxis
              tick={{ fontSize: 12, fill: '#64748b' }}
              axisLine={{ stroke: '#cbd5e1' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontFamily: 'Cairo', fontSize: '13px', paddingTop: '10px' }}
              iconType="circle"
            />
            <Bar dataKey="الحالي" fill={COLORS.blue} radius={[8, 8, 0, 0]} maxBarSize={60} />
            <Bar dataKey="الحدالأدنى" fill={COLORS.red} radius={[8, 8, 0, 0]} maxBarSize={60} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}