import { atom } from 'recoil';

const emailAtom = atom({
    key: "emailAtom",
    default: "",
});
const passwordAtom = atom({
    key:"passwordAtom",
    default:"",

});

export  {emailAtom, passwordAtom};