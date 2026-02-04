import { House } from "../../types/house";

type HouseCardProps = {
  house: House;
  onDelete: (uuid: string) => void;
};

export default function HouseCard({ house, onDelete }: HouseCardProps) {
  return (
    <div className="rounded-lg border p-4 shadow-sm">
      <h3 className="text-lg dark:text-white/90 font-bold text-gray-800">
        {house.name}
      </h3>
      <p className="text-sm dark:text-white/90 text-gray-600">
        {house.description}
      </p>

      {/* {pkg.packagePhoto && (
        <img
          src={pkg.packagePhoto}
          alt={pkg.name}
          className="mt-2 h-32 w-full object-cover rounded-md"
        />
      )} */}

      <div className="mt-2 flex items-center justify-between text-xs">
        <span className={house.isActive ? "text-green-600" : "text-red-600"}>
          {house.isActive ? "Active" : "Inactive"}
        </span>
        <button
          onClick={() => onDelete(house.uuid)}
          className="
          rounded 
          bg-red-500 
          px-2 py-1 
          text-white 
          hover:bg-red-500"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
