export type FAQ = {
   
  localizations: {
    locale: string;
    question: string;
    answer: string;
  }[];
    
};


export type editFAQ = {
  localizations: {
    locale: string;
    question?: string;
    answer?: string;
  }[];
    
};



export type getFAQ = {
  id: string
  localizations: {
    locale: string;
    question: string;
    answer: string;
  }[];
    
};

