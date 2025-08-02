import { ServiceI } from "@/src/types/services.types";

type ServiceCardProps = {
  service: ServiceI;
  onClick?: () => void;
};
export default function ServiceCard({ service, onClick }: ServiceCardProps) {
  return (
    <div
      className="cursor-pointer transition-all duration-300 border-1 rounded-4xl border-vigil-orange hover:border-vigil-orange hover:shadow-lg"
      onClick={onClick}>
      <div className="p-4 flex justify-between ">
        <div className="flex flex-col gap-0.5">
          <p className="text-sm font-semibold">{service.name}</p>
          <p className="text-[10px] text-gray-600">{service.description}</p>
        </div>
        <div className="flex flex-col gap-0.5 ">
          <p className="text-sm font-semibold ">€{service.unit_price}</p>
          <p className="text-[10px] text-gray-600">{service.unit_type}</p>
        </div>
      </div>
    </div>
  );
}
