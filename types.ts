
export interface Question {
  id: string;
  text: string;
  options: string[];
}

export interface UserAnswers {
  language: string;
  mood: string;
  era: string;
  occasion: string;
  instrument: string;
}

export interface RecommendedSong {
  name: string;
  artist: string;
  language: string;
  description: string;
}

export interface RecommendationResponse {
  songs: RecommendedSong[];
}
