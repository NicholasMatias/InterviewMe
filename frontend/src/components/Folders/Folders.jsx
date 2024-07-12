import './Folders.css'
import { setDoc, collection, getDoc, doc, getFirestore, updateDoc, arrayUnion} from "firebase/firestore";
import { db } from "../../../../backend/firebase/firebase.config.js";
import { useAuth } from '../auth/auth.jsx';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import Folder from './Folder.jsx'
import Spacing from '../landing_page/spacing/Spacing.jsx';



const Folders = () => {
    const { currentUser } = useAuth();
    const userid = currentUser.uid;
    const [folders, setFolders] = useState([])
    const [inputValue, setInputValue] = useState("")
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFolders = async () => {
            const userDocRef  = doc(db,"users",currentUser.uid);
            const userDoc = await getDoc(userDocRef);

            if(userDoc.exists()){
                const userData = userDoc.data();
                setFolders(userData.folderNames || [])
            }
        }

        fetchFolders();
    }, [currentUser.uid])

    const handleNewFolder = async (e) => {
        e.preventDefault();
        const folderName = e.target['folderName'].value;
        const thisUserDocRef = doc(db,"users", currentUser.uid);
        try {
            await updateDoc(thisUserDocRef,{
                folderNames: arrayUnion(folderName),
            })
            setFolders([...folders, folderName])

            const newFolderCollectionRef = collection(thisUserDocRef, folderName);

            await setDoc(doc(newFolderCollectionRef, "initial"),{
                createdAt: new Date(),
                name: 'Initial Document'
            })

            console.log(`Folder ${folderName} created successfully.`);
        }




        catch (error) {
            console.error("Error creating folder:", error);
        }
    }

    const toInterviewPage = () => {
        navigate('/profile')
    }

    return (
        <>
            <Spacing />
            <div className='container'>
                <div className='left-container'>
                    <form onSubmit={handleNewFolder}>
                        <h1>Create a New Folder</h1>
                        <div>
                            <label htmlFor="folderName">Folder Name: </label>
                            <input type="text" placeholder='Enter Folder Name...' id='folderName' name='folderName' required />
                        </div>
                        <button type="submit" >Create Folder</button>
                    </form>

                    <button onClick={toInterviewPage}>Interview Page</button>
                </div>

                <div className='folder-grid-container'>
                    <div className='folders-container'>
                        {folders?.map((folderName, index) => (
                            <Folder key={index} folderName={folderName} />
                        ))}


                    </div>

                </div>

            </div>
        </>
    )
}

export default Folders