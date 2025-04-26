import { X } from "lucide-react";

interface ModalProps {
    title: string;
    children: React.ReactNode;
    isOpen: boolean;
    onClose: () => void;
}

export default function Modal({ title, children, isOpen, onClose }: ModalProps) {
    if (!isOpen) return null;
    
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            {/* Backdrop with blur effect */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-md" onClick={onClose}></div>
            
            {/* Modal container */}
            <div className="bg-white w-full max-w-2xl max-h-[90vh] rounded-lg shadow-2xl relative border border-amber-200 overflow-hidden animate-fadeIn">
                {/* Header */}
                <div className="bg-gradient-to-r from-amber-500 to-amber-400 p-5 flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-amber-50 drop-shadow-sm">{title}</h2>
                    </div>

                    {/* Close button using Lucide icon */}
                    <button
                        onClick={onClose}
                        className="text-amber-50 bg-amber-700 hover:bg-amber-800 p-2 rounded-full transition-all duration-200 shadow-lg flex items-center justify-center w-10 h-10 hover:scale-105"
                        aria-label="Close"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 space-y-6 text-gray-800 overflow-y-auto max-h-[calc(90vh-80px)]">
                    {children}
                </div>
                
                {/* Footer with amber accent */}
                <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-amber-50/80 to-transparent pointer-events-none"></div>
            </div>
        </div>
    );
}