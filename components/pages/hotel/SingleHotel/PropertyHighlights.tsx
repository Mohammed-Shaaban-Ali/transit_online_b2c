"use client";

const PropertyHighlights = () => {
  const highlightsContent = [
    {
      id: 1,
      icon: "icon-city",
      text: "In City Centre",
    },
    {
      id: 2,
      icon: "icon-airplane",
      text: "Airport transfer",
    },
    {
      id: 3,
      icon: "icon-bell-ring",
      text: "Front desk [24-hour]",
    },
    {
      id: 4,
      icon: "icon-tv",
      text: "Premium TV channels",
    },
  ];

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "icon-city":
        return (
          <svg
            className="w-6 h-6 text-blue-600 mx-auto mb-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
        );
      case "icon-airplane":
        return (
          <svg
            className="w-6 h-6 text-blue-600 mx-auto mb-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            />
          </svg>
        );
      case "icon-bell-ring":
        return (
          <svg
            className="w-6 h-6 text-blue-600 mx-auto mb-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
        );
      case "icon-tv":
        return (
          <svg
            className="w-6 h-6 text-blue-600 mx-auto mb-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        );
      default:
        return <div className="w-6 h-6 bg-blue-600 rounded mx-auto mb-2" />;
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-5 pt-8">
      {highlightsContent.map((item) => (
        <div key={item.id} className="text-center">
          {getIcon(item.icon)}
          <div className="text-sm leading-tight mt-2">{item.text}</div>
        </div>
      ))}
    </div>
  );
};

export default PropertyHighlights;
