import Modal from "@/utility/modal";

import { CalendarDays, Copyright, User } from "lucide-react";


interface NewsCardProps {
    title: string;
    author: string;
    date: string;
    image: string;
    category: string;
    description : string;
    content : string;
    url : string;
  }

  interface NewsModalProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    selectedNews: NewsCardProps;
  
  }

export default function NewsModal({ isOpen , setIsOpen,selectedNews } : NewsModalProps ){
    
    const textLength = 70
    const handleCloseModal = () =>{
        
        setIsOpen(false);
       
    }

   
    const formatDate = (dateString: string) => {
    
        return new Date(dateString).toLocaleDateString(undefined,  { year: "numeric", month: "short", day: "numeric" });
      };
    
      // Format time to be more readable
      const formatTime = (dateString: string) => {
        
        return new Date(dateString).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
      };

      const truncateDescription = (text: string, maxLength: number ) => {
        if (!text) return "";
        if (text.length <= maxLength ) return text;
        return text.substring(0, maxLength).trim() + "...";
      };
    
    return(
        <Modal title={selectedNews.title} isOpen={isOpen} onClose={handleCloseModal}>
      <div className="flex-1 flex flex-col">
        <div>
          <img 
            src={selectedNews.image} 
            alt={selectedNews.title}
            className="w-full h-64 object-cover rounded-lg"
          />
          <div className="flex items-center justify-between mt-2 text-gray-500 text-s">
            <div className="flex gap-2 items-center">
              <User size={20} className="text-amber-500"/> {selectedNews.author}
            </div>
            <div className="flex gap-2 items-center">
              <CalendarDays size={20} className="text-amber-500"/> {formatDate(selectedNews.date)} {formatTime(selectedNews.date)}
            </div>
          </div>
        </div>
        
        <div className="border-t border-amber-200 mt-2 pt-2">
          <h1 className="font-semibold text-lg text-amber-700 mb-1">Description</h1>
          <p className="text-gray-700">
            {truncateDescription(selectedNews.description, textLength)}
            <span 
              className="text-amber-600 cursor-pointer hover:font-semibold ml-1" 
              onClick={() => window.location.href = selectedNews.url}
            >
              read more
            </span>
          </p>
        </div>
        
        <div className="border-t border-amber-200 mt-2 pt-2">
          <h1 className="font-semibold text-lg text-amber-700 mb-1">Content</h1>
          <p className="text-gray-700">
            {truncateDescription(selectedNews.content, 200)}
            <span 
              className="text-amber-600 cursor-pointer hover:font-semibold ml-1" 
              onClick={() => window.location.href = selectedNews.url}
            >
              read more
            </span>
          </p>
        </div>
        
        <div className="border-t border-amber-200 mt-2 pt-2 flex items-center justify-center gap-2 text-gray-600">
          <Copyright size={18} className="text-amber-500"/>
          <div>Copy Right: SeriousStock</div>
        </div>
      
        
      </div>
    </Modal>
    );
}