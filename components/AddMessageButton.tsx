import { useMessageStore } from '../store/messageStore';

export default function AddMessageButton() {
  const addMessage = useMessageStore((state) => state.addMessage);
  const handleClick = () => {
    addMessage('testing 123');
  };

  return (
    <button
      onClick={handleClick}
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    >
      Add Message
    </button>
  );
}
