export default function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div onClick={onClose} className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
      <div className="relative bg-white rounded-xl p-6 max-w-2xl w-full border border-gray-200 z-10 shadow-lg">
        {children}
      </div>
    </div>
  )
}