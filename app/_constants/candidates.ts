export const POLLING_MS = 30000;

export type CandidateStyle = {
  line: string;
  accent: string;
  bg: string;
  photo: string;
  logo: string;
};

export const CANDIDATE_STYLES: Record<number, CandidateStyle> = {
  8: {
    line: "#ee6a08",
    accent: "#ee6a08",
    bg: "bg-orange-50",
    photo: "/assets/candidatos/keiko-fujimori/foto.jpg",
    logo: "/assets/candidatos/keiko-fujimori/logo.jpg",
  },
  10: {
    line: "#5dbd14",
    accent: "#ec0d0d",
    bg: "bg-lime-50",
    photo: "/assets/candidatos/roberto-sanchez/foto.jpg",
    logo: "/assets/candidatos/roberto-sanchez/logo.jpg",
  },
  35: {
    line: "#046da6",
    accent: "#046da6",
    bg: "bg-sky-50",
    photo: "/assets/candidatos/rafael-lopez-aliaga/foto.jpg",
    logo: "/assets/candidatos/rafael-lopez-aliaga/logo.jpg",
  },
};
