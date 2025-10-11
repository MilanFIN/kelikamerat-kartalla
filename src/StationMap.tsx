import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import { useMapTypeContext } from "./providers/mapcontext";
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
    const center: LatLngExpression = [64.1807, 25.8032];
    const { tileUrl } = useMapTypeContext();

    return (
        <MapContainer
            center={center}
            zoom={6}
            scrollWheelZoom={true}
            className="absolute inset-0 z-10"
            attributionControl={true}
        >
            <TileLayer
                url={tileUrl}
                //url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                //                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
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
