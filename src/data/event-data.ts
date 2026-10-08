import { IEventDT } from "@/types/event-d-t";

export const university_classic_event_data: IEventDT[] = [
  {
    id: 1,
    date: { day: "15", month: "Okt", year: 2026 },
    title: "Sosialisasi Pengisian Tracer Study SMA & SMK Se-Kaltim",
    time: "09:00 - 12:00 WITA",
    location: "Daring (Zoom) & Disdikbud Kaltim, Samarinda",
    image: "/assets/img/event/event-thumb-1.jpg",
    link: "/tracer",
  },
  {
    id: 2,
    date: { day: "28", month: "Okt", year: 2026 },
    title: "Kaltim Career Expo & Job Fair Vokasi IKN 2026",
    time: "08:30 - 16:00 WITA",
    location: "BSCC Dome, Balikpapan",
    image: "/assets/img/event/event-thumb-2.jpg",
    link: "https://web.disdikbud.kaltimprov.go.id/",
  },
  {
    id: 3,
    date: { day: "10", month: "Nov", year: 2026 },
    title: "Batas Akhir Penyerahan Data Tracer Study Gelombang 1",
    time: "Hingga 23:59 WITA",
    location: "Portal Tracer Study Kaltim",
    image: "/assets/img/event/event-thumb-3.jpg",
    link: "/tracer",
  },
  {
    id: 4,
    date: { day: "05", month: "Des", year: 2026 },
    title: "Diseminasi Hasil Serapan Lulusan & Temu Industri DUDI",
    time: "09:00 - 15:00 WITA",
    location: "Hotel Mercure, Samarinda",
    image: "/assets/img/event/event-thumb-4.jpg",
    link: "https://web.disdikbud.kaltimprov.go.id/",
  },
];

export const kids_event_data: IEventDT[] = [
  {
    id: 5,
    date: { day: "14", month: "May", year: 2024 },
    title: "London International Conference on Education",
    image: "/assets/img/event/event-3-thumb-1.jpg",
    time: "9:00AM - 11:00AM",
    location: "United States",
  },
  {
    id: 6,
    date: { day: "08", month: "Mar", year: 2024 },
    image: "/assets/img/event/event-3-thumb-2.jpg",
    title: "Global Education Fall Meeting for Everyone",
    time: "11:00AM - 12:00AM",
    location: "United States",
  },
  {
    id: 7,
    image: "/assets/img/event/event-3-thumb-3.jpg",
    date: { day: "21", month: "Jan", year: 2024 },
    title: "Creating Futures Through Technology Conference",
    location: "United States",
    time: "2:00PM - 4:00PM",
  },
];

export const high_school_events: IEventDT[] = [
  {
    id: 8,
    date: {
      day: "29",
      month: "October",
      year: 2024,
    },
    title: "Painting Art Contest",
    time: "10:00 AM - 4:00 PM",
    location: "United States",
    image: "/assets/img/event/event-4-thumb-1.jpg",
  },
  {
    id: 9,
    date: {
      day: "29",
      month: "October",
      year: 2024,
    },
    title: "Acadia Education Fair",
    time: "11:00 AM - 5:00 PM",
    location: "United States",
    image: "/assets/img/event/event-4-thumb-2.jpg",
  },
  {
    id: 10,
    date: {
      day: "29",
      month: "October",
      year: 2024,
    },
    title: "Tech Summit 2024",
    time: "9:00 AM - 6:00 PM",
    location: "United States",
    image: "/assets/img/event/event-4-thumb-3.jpg",
  },
];

export const event_data = [
  {
    id: 11,
    date: { day: "08", month: "November", year: 2024 },
    title: "Painting Art Contest",
    time: "10:00 AM - 5:00 PM",
    location: "United States",
    image: "/assets/img/event/event/event-inner-1.jpg",
  },
  {
    id: 12,
    date: { day: "08", month: "November", year: 2024 },
    title: "Global Education Fair",
    time: "11:00 AM - 4:00 PM",
    location: "United States",
    image: "/assets/img/event/event/event-inner-2.jpg",
  },
  {
    id: 13,
    date: { day: "08", month: "November", year: 2024 },
    title: "Higher Ed Innovators",
    time: "9:00 AM - 3:00 PM",
    location: "United States",
    image: "/assets/img/event/event/event-inner-3.jpg",
  },
  {
    id: 14,
    date: { day: "08", month: "November", year: 2024 },
    title: "EdTech World Forum",
    time: "10:00 AM - 6:00 PM",
    location: "United States",
    image: "/assets/img/event/event/event-inner-4.jpg",
  },
  {
    id: 15,
    date: { day: "08", month: "November", year: 2024 },
    title: "Leadership in Education",
    time: "1:00 PM - 4:00 PM",
    location: "United States",
    image: "/assets/img/event/event/event-inner-5.jpg",
  },
  {
    id: 16,
    date: { day: "08", month: "November", year: 2024 },
    title: "Student Success Workshop",
    time: "2:00 PM - 5:00 PM",
    location: "United States",
    image: "/assets/img/event/event/event-inner-6.jpg",
  },
  {
    id: 17,
    date: { day: "08", month: "November", year: 2024 },
    title: "Global Education Fair",
    time: "11:00 AM - 4:00 PM",
    location: "United States",
    image: "/assets/img/event/event/event-inner-2.jpg",
  },
  {
    id: 13,
    date: { day: "08", month: "November", year: 2024 },
    title: "Higher Ed Innovators",
    time: "9:00 AM - 3:00 PM",
    location: "United States",
    image: "/assets/img/event/event/event-inner-3.jpg",
  },
];

export const all_events = [
  ...university_classic_event_data,
  ...kids_event_data,
  ...high_school_events,
  ...event_data,
];
