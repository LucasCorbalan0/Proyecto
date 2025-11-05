export default function CardSimple({ title, value, subtitle, icon }) {
  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
        <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
      </div>
      <div>{icon}</div>
    </div>
  )
}