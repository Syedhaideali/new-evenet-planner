import {
    auth,
    db,
    storage,
    onAuthStateChanged,
    signOut,
    getDoc,
    getDocs,
    doc,
    collection,
    query,
    where,
    updateDoc,
    arrayUnion,
    arrayRemove,
    deleteDoc,
} from "../utils/utils.js";

const logout_btn = document.getElementById("logout_btn");
const login_link = document.getElementById("login_link");
const user_img = document.getElementById("user_img");
const event_card_container = document.getElementById("event_card_container");


onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in
        const uid = user.uid;
        login_link.style.display = 'none';
        user_img.style.display = 'inline-block';
        getUserInfo(uid);
        getMyEvents(user.uid);
    } else {
        // User is signed out
        login_link.style.display = 'inline-block';
        user_img.style.display = 'none';
        event_card_container.innerHTML = '';
    }
});

logout_btn.addEventListener("click", async () => {
    try {
        await signOut(auth);
    } catch (error) {
        console.error("Error signing out: ", error);
    }
});

async function getUserInfo(uid) {
    try {
        const userRef = doc(db, "IDs", uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
            user_img.src = userDoc.data().img;
        } else {
            console.log("No such document!");
        }
    } catch (error) {
        console.error("Error getting user info: ", error);
    }
}

async function getMyEvents(uid) {
    try {
        const q = query(collection(db, "events"), where("createdBy", "==", uid));
        const querySnapshot = await getDocs(q);
        
        event_card_container.innerHTML = '';
        if (querySnapshot.empty) {
            console.log("No events found for this user.");
            return;
        }

        querySnapshot.forEach((doc) => {
            console.log(`${doc.id} => ${doc.data()}`);

            const event = doc.data();

            const { banner, title, location, createdByEmail, desc, time, date, likes = [] } = event;

            const card = `
                <div class="event-card">
                    <img class="rounded-t-lg" src="${banner}" alt="Event Image" />
                    <div class="p-5">
                        <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900">${title}</h5>
                        <p class="mb-3 font-normal text-gray-700">Time: ${date}, ${time}</p>
                        <p class="mb-3 font-normal text-gray-700">Creator: ${createdByEmail}</p>
                        <p class="mb-3 font-normal text-gray-700">Location: ${location}</p>
                       
                        <button id = ${doc.id} onclick = "deleteEvent(this)" class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:ring-blue-300">
                           Delete
                        </button>
                    </div>
                </div>`;
            window.deleteEvent = deleteEvent

            event_card_container.innerHTML += card;
        });
    } catch (error) {
        console.error("Error getting events: ", error);
    }
}


async function deleteEvent(e){
    console.log(e);

    const docRef = doc(db, 'events' , e.id);
    await deleteDoc(docRef)
    getMyEvents(auth.currentUser.uid);

}