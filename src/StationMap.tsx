import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

interface StationMapProps {
    stations: any[];
    isLoading: boolean;
    isError: boolean;
    onStationSelect: (station: any) => void;
}

export default function StationMap({
    stations,
    isLoading,
    isError,
    onStationSelect,
}: StationMapProps) {
    return (
        <MapContainer
            center={[64.1807, 25.8032]}
            zoom={6}
            scrollWheelZoom={true}
            className="absolute inset-0 z-10"
        >
            <TileLayer
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
				//                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />

            {/* Show markers when data is loaded */}
            {!isLoading &&
                !isError &&
                stations?.map((station: any) => (
                    <Marker
                        key={station.id}
                        position={[
                            station.coordinates[1],
                            station.coordinates[0],
                        ]}
                    >
                        <Popup>
                            <div className="space-y-2">
                                <div>
                                    <strong>{station.name}</strong>
                                    <br />
                                    Updated:{" "}
                                    {new Date(
                                        station.updatedTime
                                    ).toLocaleString()}
                                </div>
                                <button
                                    onClick={() => onStationSelect(station)}
                                    className="px-2 py-1 text-sm rounded-lg text-stone-400 hover:text-stone-600 
                                               bg-stone-800 dark:bg-stone-300 dark:text-stone-800 transition"
                                >
                                    Details
                                </button>
                            </div>
                        </Popup>
                    </Marker>
                ))}
        </MapContainer>
    );
}
