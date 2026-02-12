import { FaWifi, FaCar, FaUtensils, FaCouch, FaShieldAlt, FaBan } from 'react-icons/fa';

const PopularFacilities = () => {
  const facilities = [
    { icon: FaBan, text: 'Non-smoking rooms' },
    { icon: FaWifi, text: 'Free WiFi' },
    { icon: FaCar, text: 'Parking' },
    { icon: FaUtensils, text: 'Kitchen' },
    { icon: FaCouch, text: 'Living Area' },
    { icon: FaShieldAlt, text: 'Safety & security' },
  ];

  return (
    <>
      {facilities.map((facility, index) => {
        const IconComponent = facility.icon;
        return (
          <div key={index} className="flex items-center gap-4">
            <IconComponent className="text-xl text-gray-700" />
            <div className="text-sm">{facility.text}</div>
          </div>
        );
      })}
    </>
  );
};

export default PopularFacilities;

