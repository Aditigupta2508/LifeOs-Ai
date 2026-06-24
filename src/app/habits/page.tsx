"use client";

import { useEffect, useState } from "react";
import {
collection,
getDocs,
addDoc,
deleteDoc,
updateDoc,
doc
} from "firebase/firestore";

import { db } from "@/lib/firebase";

import {
Flame,
Trash2,
CheckCircle,
Circle
} from "lucide-react";


export default function HabitsPage() {

const [habits,setHabits]=useState<any[]>([]);

const [name,setName]=useState("");

const [category,setCategory]=useState("Study");

const [notes,setNotes]=useState("");

const [search,setSearch]=useState("");



useEffect(()=>{

loadHabits()

},[])



async function loadHabits(){

const snapshot=await getDocs(

collection(db,"habits")

)

const data = snapshot.docs.map((doc) => {

const h = doc.data();

return {

id: doc.id,

name:
h.name ||
h.habitName ||
"Untitled Habit",

category:
h.category ||
"General",

notes:
h.notes ||
"",

completed:
h.completed ??
false,

streak:
h.streak ||
0,

createdAt:
h.createdAt ||
new Date()

};

});

setHabits(data)

}




async function saveHabit(){

if(!name)return



await addDoc(

collection(db,"habits"),

{

name,

category,

notes,

completed:false,

streak:0,

createdAt:new Date()

}

)


setName("")
setNotes("")


loadHabits()


}





async function toggleHabit(habit:any){

await updateDoc(

doc(db,"habits",habit.id),

{

completed:!habit.completed,


streak:

habit.completed

?habit.streak

:habit.streak+1

}

)


loadHabits()

}



async function removeHabit(id:string){

await deleteDoc(

doc(db,"habits",id)

)

loadHabits()

}



const filtered = habits.filter((habit) => {

const habitTitle =

habit.name ||

habit.habitName ||

"";


return habitTitle
.toLowerCase()
.includes(
search.toLowerCase()
);

});




const completed =
habits.filter(
(h) => h.completed === true
).length;




const percent=

habits.length===0

?0

:Math.round(

(completed/habits.length)*100

)



return(


<div className="min-h-screen bg-slate-950 text-white p-8">


<h1 className="text-5xl font-bold mb-8">

Habit Tracker


</h1>




<div className="grid md:grid-cols-4 gap-5 mb-8">



<Card

title="Total"

value={habits.length}

/>


<Card

title="Completed"

value={completed}

/>



<Card

title="Success"

value={`${percent}%`}

/>



<Card

title="Longest"

value={

Math.max(

...habits.map(

h=>h.streak||0

),

0

)

}

/>



</div>





<div className="bg-slate-900 p-8 rounded-3xl">


<input

placeholder="Habit Name"

value={name}

onChange={(e)=>setName(e.target.value)}

className="w-full p-4 rounded-xl bg-slate-800 mb-4"

/>




<select

value={category}

onChange={(e)=>setCategory(e.target.value)}

className="w-full p-4 rounded-xl bg-slate-800 mb-4"

>


<option>

Study

</option>

<option>

Coding

</option>

<option>

Fitness

</option>

<option>

Reading

</option>

<option>

Meditation

</option>


</select>




<textarea

placeholder="Notes"

value={notes}

onChange={(e)=>setNotes(e.target.value)}

className="w-full p-4 rounded-xl bg-slate-800 mb-4"


/>




<button

onClick={saveHabit}

className="bg-blue-600 px-6 py-3 rounded-xl"


>

Add Habit


</button>



</div>






<input


placeholder="Search Habit"


value={search}


onChange={(e)=>setSearch(e.target.value)}

className="w-full mt-8 p-4 rounded-xl bg-slate-800"


/>






<div className="mt-10 space-y-5">



{


filtered.map((habit)=>(


<div

key={habit.id}

className="bg-slate-900 p-6 rounded-3xl"


>




<div className="flex justify-between">



<div>



<h2 className="text-2xl font-bold">

{habit.name}


</h2>



<p className="text-slate-400">


{habit.category}


</p>



<p className="mt-2">


{habit.notes}


</p>




<div className="flex gap-3 mt-4">


<Flame size={18}/>


<p>


{habit.streak}


days


</p>


</div>



</div>






<div className="space-y-3">



<button

onClick={()=>toggleHabit(habit)}

className="bg-green-600 p-3 rounded-xl"


>



{

habit.completed


?

<CheckCircle/>


:


<Circle/>


}



</button>




<button

onClick={()=>removeHabit(habit.id)}

className="bg-red-600 p-3 rounded-xl"

>

<Trash2/>


</button>


</div>



</div>




{

habit.streak>=30


&&


<p className="mt-4">

👑 Habit Master


</p>

}



</div>


))


}




</div>




</div>

)



}



function Card({title,value}:any){

return(

<div className="bg-slate-900 p-6 rounded-3xl">


<p className="text-slate-400">

{title}


</p>



<h2 className="text-4xl font-bold mt-3">


{value}


</h2>



</div>

)


}