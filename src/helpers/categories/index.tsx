import React from 'react';
import { UilBan, UilBrain, UilDiceFive, UilFilm, UilKayak, UilKid, UilMicrophone, UilMusic, UilPresentation, UilRefresh, UilUniversity } from '@iconscout/react-unicons';


export enum ECategories {
    RESET = "reset",
    EXHIBITIONS = "exhibitions",
    KIDS = "kids",
    LEISURE = "leisure",
    STANDUP = "standUp",
    EDUCATION = "education",
    THEATERS = "theaters",
    GAMES = "games",
    MOVIE =  "movie",
    CONCERTS = "concerts",
}

export type Category = {
    value: ECategories;
    text: string;
    icon: React.JSX.Element;
}

export const CATEGORIES:Category[] = [
    {
        value: ECategories.RESET,
        text: "Сбросить",
        icon: <UilBan size={25} />,
    },
    {
        value: ECategories.EXHIBITIONS,
        text: "Выставки",
        icon: <UilPresentation size={25} />,
    },
    {
        value: ECategories.KIDS,
        text: "С детьми",
        icon: <UilKid size={25} />,
    },
    {
        value: ECategories.LEISURE,
        text: "Активный отдых",
        icon: <UilKayak size={25} />,
    },
    {
        value: ECategories.STANDUP,
        text: "Стендап",
        icon: <UilMicrophone size={25} />,
    },
    {
        value: ECategories.EDUCATION,
        text: "Образование",
        icon: <UilBrain size={25} />,
    },
    {
        value: ECategories.THEATERS,
        text: "Театры",
        icon: <UilUniversity size={25} />,
    },
    {
        value: ECategories.GAMES,
        text: "Игры",
        icon: <UilDiceFive size={25} />,
    },
    {
        value: ECategories.MOVIE,
        text: "Кино",
        icon: <UilFilm size={25} />,
    },
    {
        value: ECategories.CONCERTS,
        text: "Концерты",
        icon: <UilMusic size={25} />,
    },
]