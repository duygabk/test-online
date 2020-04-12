import * as firebase  from 'firebase'

const DATABASE = 'data001'
// firebase config
const firebaseConfig = {
    apiKey: "AIzaSyC_pbuxgg-_MLI2ltEaRDjujcvgXH1gwyY",
    authDomain: "aaaaa-580ef.firebaseapp.com",
    databaseURL: "https://aaaaa-580ef.firebaseio.com",
    projectId: "aaaaa-580ef",
    storageBucket: "aaaaa-580ef.appspot.com",
    messagingSenderId: "868780603999",
    appId: "1:868780603999:web:5dc93ef4505eb93f"
  };

export const firebaseConnect = firebase.initializeApp(firebaseConfig);
// Read Database
const data = firebase.database().ref(DATABASE);

let keys;
let allExam;
data.once('value').then(function(snapshot) {
    allExam = snapshot.val();
    // console.log(typeof data);
    keys = Object.keys(allExam);
    // console.log(keys);
})

// Edit --> must be use id
// data.set({

// })

// Add New Database, use push -> auto create ID

// Remove data -> data.child("id").remove();
// 
export function addQuestion(question = {}) {
    question = {
        content: "fake question 4",
        title: "fake title 4"
    }
    const addItem = data.push(question);
    // console.log({addItem})
}
// addQuestion();
export function getQuestion(examNumber) {
    data.once('value').then(snapshot => {
        const allExample =  snapshot.val(); // all Object of exam
        const keys = Object.keys(allExample);
        const ret = allExample[keys[examNumber]];
        // console.log({ret});
        return ret; 
    });
}

export function getAllQuestion() {
    return data.once('value').then( snapshot => {
        const allExam = snapshot.val(); // Object
        const keys = Object.keys(allExam);
        const arrayOfExample = keys.map(key => allExam[key]);
        // console.log({arrayOfExample});     
        return arrayOfExample;  
    });
}

function getIDfromNumber(number) {
    if (number > keys.length) return false;
    return keys[number];
}

function reloadData() {
    data.once('value').then(function(snapshot) {
        allExam = snapshot.val();
        keys = Object.keys(allExam);
    })
}

export function removeExamByNumber(examNumber) {
    const id = getIDfromNumber(examNumber);
    data.child(id).remove().then(resp => {
        // console.log(`Remove item ${resp}`);
        reloadData();  
    });
}

export function getDataByID(id) {
    return data.child(id).once('value').then(snapshot => {
        return snapshot.val();
    })
}

getDataByID("exam001").then(res => console.log(res))

// test ex
const templateObj = {
    title: "Exam title",
    comment: "Exam Comonet",
    questions: {
        ques1: {
            title: "Ques 1 title",
            content: "Ques 1 Content",
            answers: {
                an1: "111", an2: "222"
            },
            correct: 1
        },
        ques2: {
            title: "Ques 2 title",
            content: "Ques 2 Content",
            answers: {
                an1: "111", an2: "222"
            },
            correct: 1
        },
        ques3:{
            title: "Ques 3 title",
            content: "Ques 3 Content",
            answers: {
                an1: "111", an2: "222"
            },
            correct: 1
        }
    }
}

const oneQuestionTemp = {
    title: "one question title",
    content: "one question content",
    answers: {

    },
    correct: 1 
}

// data.child("-M4iZK62ggBqw9PQnbqw").child("questions").child("-M4i_6rjT304mCXQ0YWY").child("answers").push("an1");
// data.child("-M4iZK62ggBqw9PQnbqw").child("questions").child("-M4i_6rjT304mCXQ0YWY").child("answers").push("an2");
// console.log(templateObj);
// data.push(templateObj)
// export default { firebaseConnect, addQuestion, getQuestion };