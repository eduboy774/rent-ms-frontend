import { useModal } from "../../../hooks/useModal";
import { useState } from "react";
import { GET_HOUSES, GET_ROOMS } from "../../../graphql/queries";
import { useMutation, useQuery } from "@apollo/client";
import type {
  CreateRoomVars,
  CreateRoomMutation,
  Rooms,
  RoomFilteringInputObject,
  RoomInputObject,
} from "../../../types/rooms";

import { Audio, BallTriangle } from "react-loader-spinner";
import { ACTIVATE_OR_DEACTIVATE_ROOM, CREATE_ROOM } from "../../../graphql/mutation";
import { useToast } from "../../../components/notifications/useToast";
import ConfirmToast from "../../../components/notifications/confirmation";
import { toast } from "react-toastify";

import RoomModal from "./roomModal";
import RoomTable from "./roomTable";
import { HouseFilteringInputObject } from "../../../types/house";

export default function Room() {
  const { isOpen, openModal, closeModal } = useModal();

  /* ===== FORM STATE ===== */
  const [roomName, setRoomName] = useState("");
  const [roomNumber, setRoomNumber] = useState<number | null>(null);
  const [capacity, setCapacity] = useState<number | null>(null);
  const [pricePerNight, setPricePerNight] = useState<number | null>(null);
  const [houseUuid, setHouseUuid] = useState<string | null>(null);

  /* ===== DATA STATE ===== */
  const [rooms, setRooms] = useState<Rooms[]>([]);
  const [houses, setHouses] = useState<any[]>([]);

  const { success, error, info } = useToast();

  /* ===== MUTATIONS ===== */
  const [createRoom] = useMutation<CreateRoomMutation, CreateRoomVars>(CREATE_ROOM);
  const [deleteRoom] = useMutation(ACTIVATE_OR_DEACTIVATE_ROOM);

  /* ===== FILTERS ===== */
  const defaultFilter: RoomFilteringInputObject = {
    uuid: null,
  };

  const defaultHouseFilter: HouseFilteringInputObject = {
    uuid: null,
    name: null,
  };

  /* ===== QUERIES ===== */
  const {
    loading: LoadingRoom,
    error: RoomError,
  } = useQuery(GET_ROOMS, {
    variables: { filtering: defaultFilter },
    onCompleted: (data) => {
      setRooms(data?.getRooms?.data || []);
    },
  });

  const { loading: LoadingHouse } = useQuery(GET_HOUSES, {
    variables: { filtering: defaultHouseFilter },
    onCompleted: (data) => {
      setHouses(data?.getHouses?.data || []);
    },
  });

  /* ===== SELECT OPTIONS ===== */
  const houseOptions = houses.map((house) => ({
    label: house.name,
    value: house.uuid,
  }));

  /* ===== DELETE ===== */
  const handleDelete = (uuid: string) => {
    const toastId = toast(
      <ConfirmToast
        onConfirm={async () => {
          toast.dismiss(toastId);
          try {
            const { data } = await deleteRoom({ variables: { uuid } });
            const response = data?.deleteRoomMutation?.response;

            if (response?.code === 9000) {
              setRooms((prev) => prev.filter((r) => r.uuid !== uuid));
              toast.success("Room deleted successfully.");
            } else {
              toast.error(response?.message || "Failed to delete room.");
            }
          } catch {
            toast.error("An error occurred while deleting.");
          }
        }}
        onCancel={() => toast.dismiss(toastId)}
      />
    );
  };

  /* ===== SAVE ===== */
  const handleSave = async () => {
    if (roomName === "" || roomNumber === null || !houseUuid) {
      info("Room name, number and house are required");
      return;
    }

    const input: RoomInputObject = {
      uuid: null,
      name: roomName,
      number: roomNumber,
      capacity,
      pricePerNight,
      houseUuid,
    };

    try {
      const { data } = await createRoom({ variables: { input } });
      const response: any = data?.createRoomMutation;
      const newRoom = response?.data;

      if (response?.response?.code === 9000 && newRoom) {
        success(response.response.message);
        setRooms((prev) => [newRoom, ...prev]);
        closeModal();
      } else {
        error(response?.response?.message);
      }
    } catch (err) {
      console.error("Mutation error:", err);
      error("Failed to create room");
    }
  };

  /* ===== LOADING / ERROR ===== */
  if (LoadingRoom || LoadingHouse)
    return (
      <Audio
        height="80"
        width="80"
        color="green"
        ariaLabel="three-dots-loading"
      />
    );

  if (RoomError)
    return (
      <BallTriangle
        height={100}
        width={100}
        radius={5}
        color="#4fa94d"
        ariaLabel="ball-triangle-loading"
        visible
      />
    );

  /* ===== UI ===== */
  return (
    <div className="p-2 border border-gray-200 rounded-xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-2 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
            Room Information
          </h2>
        </div>

        <button
          onClick={openModal}
          className="
            flex w-full items-center justify-center gap-2
            rounded-full border border-gray-300
            bg-orange-500 px-4 py-3 text-sm font-medium
            text-white shadow-theme-xs
            hover:bg-orange-500 hover:text-white
            dark:border-gray-700 dark:bg-orange-500
            dark:text-white dark:hover:bg-orange-500
            lg:inline-flex lg:w-auto
          "
        >
          <svg
            className="fill-current"
            width="18"
            height="18"
            viewBox="0 0 18 18"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M9 2C9.27614 2 9.5 2.22386 9.5 2.5V8.5H15.5C15.7761 8.5 16 8.72386 16 9C16 9.27614 15.7761 9.5 15.5 9.5H9.5V15.5C9.5 15.7761 9.27614 16 9 16C8.72386 16 8.5 15.7761 8.5 15.5V9.5H2.5C2.22386 9.5 2 9.27614 2 9C2 8.72386 2.22386 8.5 2.5 8.5H8.5V2.5C8.5 2.22386 8.72386 2 9 2Z"
            />
          </svg>
          Add Room
        </button>
      </div>

      <RoomTable rooms={rooms} onDelete={handleDelete} />

      <RoomModal
        isOpen={isOpen}
        onClose={closeModal}
        name={roomName}
        setName={setRoomName}
        number={roomNumber}
        setNumber={setRoomNumber}
        capacity={capacity}
        setCapacity={setCapacity}
        pricePerNight={pricePerNight}
        setPricePerNight={setPricePerNight}
        houses={houseOptions}
        houseUuid={houseUuid}
        setHouseUuid={setHouseUuid}
        onSave={handleSave}
      />
    </div>
  );
}
