
export interface TimelineEvent {
  time: string;
  title: string;
  description?: string;
  isKeyMoment?: boolean;
}

export interface Exhibition {
  id: string;
  title: string;
  date: string;
  germanDate: string; // For user-friendly display
  description: string;
  coverImage: string;
  detailImages?: string[];
  artist?: string;
  djs?: string[];
  timeline: TimelineEvent[];
  isUpcoming?: boolean;
  isCurrent?: boolean;
}

// Sample data with a current exhibition, upcoming exhibitions, and past exhibitions
export const exhibitions: Exhibition[] = [
  // Current Exhibition
  {
    id: "current-exhibition-2024",
    title: "Farben der Stadt",
    date: "2024-11-09",
    germanDate: "9. November 2024",
    description: "Eine Sammlung urbaner Kunstwerke, die die Essenz Berlins durch abstrakte Farbkompositionen einfangen. Die Ausstellung präsentiert Werke, die den vibrierenden Geist der Stadt reflektieren.",
    coverImage: "/images/current-exhibition.jpg",
    detailImages: [
      "/images/current-detail-1.jpg",
      "/images/current-detail-2.jpg",
      "/images/current-detail-3.jpg",
      "/images/current-detail-4.jpg",
      "/images/current-detail-5.jpg",
    ],
    artist: "Maja Wiśniewski",
    djs: ["DJ Electric", "SoundMaster B"],
    timeline: [
      {
        time: "17:00 - 19:00",
        title: "Vorbesichtigung und Begrüßungs-Drink",
        description: "Exklusiver Zugang zur Ausstellung mit einem Glas Sekt oder Wasser."
      },
      {
        time: "19:00 - 19:30",
        title: "Vernissage",
        description: "Offizielle Eröffnung mit einer kurzen Ansprache der Künstlerin.",
        isKeyMoment: true
      },
      {
        time: "19:30 - 21:30",
        title: "Kunst und Gespräche",
        description: "Entdecken Sie die Ausstellung und tauschen Sie sich mit anderen Kunstliebhabern aus."
      },
      {
        time: "21:30 - 22:00",
        title: "Kleine Performance",
        description: "Live-Kunstperformance von Maja Wiśniewski.",
        isKeyMoment: true
      },
      {
        time: "22:00 - 02:00",
        title: "After-Party",
        description: "Musik mit DJ Electric und SoundMaster B",
        isKeyMoment: true
      }
    ],
    isCurrent: true
  },
  
  // Upcoming Exhibitions
  {
    id: "upcoming-exhibition-1",
    title: "Licht & Schatten",
    date: "2024-12-14",
    germanDate: "14. Dezember 2024",
    description: "Eine Exploration der Kontraste zwischen Licht und Dunkelheit, die urbane Räume definieren. Fotografien und Installationen schaffen einen Dialog zwischen Architektur und natürlichem Licht.",
    coverImage: "/images/upcoming-1.jpg",
    artist: "Thomas Bauer",
    timeline: [
      {
        time: "18:00 - 20:00",
        title: "Ausstellungseröffnung",
        description: "Offener Zugang zur Ausstellung mit einem Glas Wein."
      },
      {
        time: "20:00 - 20:30",
        title: "Künstlergespräch",
        description: "Thomas Bauer im Interview über seine Werke.",
        isKeyMoment: true
      },
      {
        time: "20:30 - 23:00",
        title: "Networking & Drinks",
        description: "Zeit für Gespräche und Kontakte in entspannter Atmosphäre."
      }
    ],
    isUpcoming: true
  },
  {
    id: "upcoming-exhibition-2",
    title: "Textile Kunst Berlin",
    date: "2025-01-25",
    germanDate: "25. Januar 2025",
    description: "Eine Sammlung zeitgenössischer textiler Kunstwerke, die Tradition und Moderne verbinden. Die ausgestellten Stücke erforschen die Grenzen zwischen Handwerk und Kunst.",
    coverImage: "/images/upcoming-2.jpg",
    artist: "Kollektiv Fadenwelt",
    timeline: [
      {
        time: "16:00 - 19:00",
        title: "Offene Ausstellung",
        description: "Besuchen Sie die Ausstellung und entdecken Sie textile Kunst."
      },
      {
        time: "19:00 - 20:00",
        title: "Workshop: Einführung in Textilkunst",
        description: "Lernen Sie grundlegende Techniken der textilen Gestaltung.",
        isKeyMoment: true
      },
      {
        time: "20:00 - 22:00",
        title: "Diskussionsrunde",
        description: "Gespräch mit den Künstlerinnen des Kollektivs Fadenwelt."
      }
    ],
    isUpcoming: true
  },
  
  // Past Exhibitions for the Archive
  {
    id: "past-exhibition-1",
    title: "Urbane Geometrie",
    date: "2024-08-22",
    germanDate: "22. August 2024",
    description: "Diese Ausstellung untersuchte die geometrischen Muster in der städtischen Architektur Berlins. Durch Fotografien, Gemälde und Installationen wurden die versteckten Strukturen der Stadt sichtbar gemacht.",
    coverImage: "/images/past-1.jpg",
    detailImages: [
      "/images/past-1-detail-1.jpg",
      "/images/past-1-detail-2.jpg",
      "/images/past-1-detail-3.jpg",
      "/images/past-1-detail-4.jpg",
      "/images/past-1-detail-5.jpg",
      "/images/past-1-detail-6.jpg",
    ],
    artist: "Julia Hoffmann",
    timeline: [
      {
        time: "18:00 - 19:30",
        title: "Eröffnung",
        description: "Begrüßung und Einführung in die Ausstellung."
      },
      {
        time: "19:30 - 21:00",
        title: "Architektonische Führung",
        description: "Eine Führung durch die ausgestellten Werke mit Fokus auf städtebauliche Aspekte.",
        isKeyMoment: true
      },
      {
        time: "21:00 - 23:00",
        title: "Musik & Drinks",
        description: "Ausklang mit elektronischer Musik und Getränken."
      }
    ]
  },
  {
    id: "past-exhibition-2",
    title: "Digitale Realitäten",
    date: "2024-06-15",
    germanDate: "15. Juni 2024",
    description: "Eine Ausstellung zu digitaler Kunst und virtuellen Welten. Die Werke erforschten die Schnittstelle zwischen physischer Realität und digitalen Räumen durch interaktive Installationen.",
    coverImage: "/images/past-2.jpg",
    detailImages: [
      "/images/past-2-detail-1.jpg",
      "/images/past-2-detail-2.jpg",
      "/images/past-2-detail-3.jpg",
      "/images/past-2-detail-4.jpg",
    ],
    artist: "Kollektiv PixelArt",
    timeline: [
      {
        time: "17:00 - 18:30",
        title: "Tech-Setup & erste Besucher",
        description: "Die digitalen Installationen werden aktiviert und erste Besucher können diese testen."
      },
      {
        time: "18:30 - 19:15",
        title: "Technologievortrag",
        description: "Kurzer Vortrag über die Verschmelzung von Kunst und Technologie.",
        isKeyMoment: true
      },
      {
        time: "19:15 - 22:00",
        title: "Interaktive Session",
        description: "Besucher können mit den digitalen Kunstwerken interagieren und eigene Erfahrungen sammeln."
      }
    ]
  },
  {
    id: "past-exhibition-3",
    title: "Berliner Nächte",
    date: "2024-03-18",
    germanDate: "18. März 2024",
    description: "Eine photographische Reise durch die Nachtkultur Berlins. Die Ausstellung zeigte die vibrierende Clubszene und die stillen Momente der Stadt nach Einbruch der Dunkelheit.",
    coverImage: "/images/past-3.jpg",
    detailImages: [
      "/images/past-3-detail-1.jpg",
      "/images/past-3-detail-2.jpg",
      "/images/past-3-detail-3.jpg",
      "/images/past-3-detail-4.jpg",
      "/images/past-3-detail-5.jpg",
    ],
    artist: "Markus Schneider",
    djs: ["DJ Nachtfalter", "Berlin Beats"],
    timeline: [
      {
        time: "20:00 - 21:30",
        title: "Nachtvernissage",
        description: "Eröffnung der Ausstellung bei Nacht mit stimmungsvoller Beleuchtung.",
        isKeyMoment: true
      },
      {
        time: "21:30 - 22:30",
        title: "Fotografisches Storytelling",
        description: "Der Künstler erzählt die Geschichten hinter seinen Nachtaufnahmen."
      },
      {
        time: "22:30 - 03:00",
        title: "Clubnacht",
        description: "Party mit DJ Nachtfalter und Berlin Beats, inspiriert von der Berliner Clubkultur.",
        isKeyMoment: true
      }
    ]
  }
];

// Helper functions
export const getCurrentExhibition = (): Exhibition | undefined => {
  return exhibitions.find(exhibition => exhibition.isCurrent);
};

export const getUpcomingExhibitions = (): Exhibition[] => {
  return exhibitions.filter(exhibition => exhibition.isUpcoming);
};

export const getPastExhibitions = (): Exhibition[] => {
  return exhibitions.filter(exhibition => !exhibition.isCurrent && !exhibition.isUpcoming)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const getExhibitionById = (id: string): Exhibition | undefined => {
  return exhibitions.find(exhibition => exhibition.id === id);
};
