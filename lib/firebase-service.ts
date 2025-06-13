import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  updateDoc,
  onSnapshot,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore"
import { db, auth } from "./firebase"
import { onAuthStateChanged } from "firebase/auth"

// Type definitions
export interface Script {
  id: string
  title: string
  category: string
  content: string
  description: string
  imageUrl?: string
  tags: string[]
  pinned: boolean
  favorited: boolean
  createdAt: string | Timestamp
  version: number
  userId: string
}

export interface QuickAction {
  id: string
  name: string
  content: string
  userId: string
}

// Add Template interface and Firebase operations for templates
export interface Template {
  id: string
  name: string
  description?: string
  content: string
  placeholders: string[]
  createdAt: string | Timestamp
  userId: string
}

// Wait for authentication to be ready
const waitForAuth = (): Promise<string | null> => {
  return new Promise((resolve) => {
    if (auth.currentUser) {
      resolve(auth.currentUser.uid)
      return
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe()
      resolve(user?.uid || null)
    })
  })
}

// Get current user ID safely
const getCurrentUserId = async () => {
  const userId = await waitForAuth()
  if (!userId) {
    throw new Error("User not authenticated")
  }
  return userId
}

// Scripts collection operations
export const scriptsCollection = collection(db, "scripts")

export const getScripts = async () => {
  try {
    const userId = await getCurrentUserId()
    const q = query(scriptsCollection, where("userId", "==", userId))
    const snapshot = await getDocs(q)
    return snapshot.docs.map((doc) => {
      const data = doc.data() as Script
      return {
        ...data,
        id: doc.id,
        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : data.createdAt,
      }
    })
  } catch (error) {
    console.error("Error getting scripts:", error)
    return []
  }
}

export const subscribeToScripts = (callback: (scripts: Script[]) => void) => {
  let unsubscribe = () => {}

  const setupSubscription = async () => {
    try {
      const userId = await getCurrentUserId()
      const q = query(scriptsCollection, where("userId", "==", userId))

      unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const scripts = snapshot.docs.map((doc) => {
            const data = doc.data() as Script
            return {
              ...data,
              id: doc.id,
              createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : data.createdAt,
            }
          })
          callback(scripts)
        },
        (error) => {
          console.error("Error in scripts subscription:", error)
          callback([])
        },
      )
    } catch (error) {
      console.error("Error setting up scripts subscription:", error)
      callback([])
    }
  }

  setupSubscription()

  return () => unsubscribe()
}

export const addScript = async (script: Omit<Script, "id" | "userId" | "createdAt">) => {
  try {
    const userId = await getCurrentUserId()
    const newScript = {
      ...script,
      userId,
      createdAt: serverTimestamp(),
    }
    const docRef = doc(scriptsCollection)
    await setDoc(docRef, newScript)
    return { ...newScript, id: docRef.id }
  } catch (error) {
    console.error("Error adding script:", error)
    throw error
  }
}

export const updateScript = async (id: string, script: Partial<Script>) => {
  try {
    const scriptRef = doc(scriptsCollection, id)
    await updateDoc(scriptRef, {
      ...script,
      updatedAt: serverTimestamp(),
    })
  } catch (error) {
    console.error("Error updating script:", error)
    throw error
  }
}

export const deleteScript = async (id: string) => {
  try {
    // Delete the script document
    await deleteDoc(doc(scriptsCollection, id))
  } catch (error) {
    console.error("Error deleting script:", error)
    throw error
  }
}

// Quick Actions collection operations
export const quickActionsCollection = collection(db, "quickActions")

export const getQuickActions = async () => {
  try {
    const userId = await getCurrentUserId()
    const q = query(quickActionsCollection, where("userId", "==", userId))
    const snapshot = await getDocs(q)
    return snapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    })) as QuickAction[]
  } catch (error) {
    console.error("Error getting quick actions:", error)
    return []
  }
}

export const subscribeToQuickActions = (callback: (quickActions: QuickAction[]) => void) => {
  let unsubscribe = () => {}

  const setupSubscription = async () => {
    try {
      const userId = await getCurrentUserId()
      const q = query(quickActionsCollection, where("userId", "==", userId))

      unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const quickActions = snapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          })) as QuickAction[]
          callback(quickActions)
        },
        (error) => {
          console.error("Error in quick actions subscription:", error)
          callback([])
        },
      )
    } catch (error) {
      console.error("Error setting up quick actions subscription:", error)
      callback([])
    }
  }

  setupSubscription()

  return () => unsubscribe()
}

export const addQuickAction = async (quickAction: Omit<QuickAction, "id" | "userId">) => {
  try {
    const userId = await getCurrentUserId()
    const newQuickAction = {
      ...quickAction,
      userId,
    }
    const docRef = doc(quickActionsCollection)
    await setDoc(docRef, newQuickAction)
    return { ...newQuickAction, id: docRef.id }
  } catch (error) {
    console.error("Error adding quick action:", error)
    throw error
  }
}

export const updateQuickAction = async (id: string, quickAction: Partial<QuickAction>) => {
  try {
    const quickActionRef = doc(quickActionsCollection, id)
    await updateDoc(quickActionRef, quickAction)
  } catch (error) {
    console.error("Error updating quick action:", error)
    throw error
  }
}

export const deleteQuickAction = async (id: string) => {
  try {
    await deleteDoc(doc(quickActionsCollection, id))
  } catch (error) {
    console.error("Error deleting quick action:", error)
    throw error
  }
}

// Templates collection operations
export const templatesCollection = collection(db, "templates")

export const getTemplates = async () => {
  try {
    const userId = await getCurrentUserId()
    const q = query(templatesCollection, where("userId", "==", userId))
    const snapshot = await getDocs(q)
    return snapshot.docs.map((doc) => {
      const data = doc.data() as Template
      return {
        ...data,
        id: doc.id,
        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : data.createdAt,
      }
    })
  } catch (error) {
    console.error("Error getting templates:", error)
    return []
  }
}

// Update the subscribeToTemplates function to handle permission errors better
export const subscribeToTemplates = (callback: (templates: Template[]) => void) => {
  let unsubscribe = () => {}

  const setupSubscription = async () => {
    try {
      const userId = await getCurrentUserId()
      const q = query(templatesCollection, where("userId", "==", userId))

      // Try to set up the subscription
      try {
        unsubscribe = onSnapshot(
          q,
          (snapshot) => {
            const templates = snapshot.docs.map((doc) => {
              const data = doc.data() as Template
              return {
                ...data,
                id: doc.id,
                createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : data.createdAt,
              }
            })
            callback(templates)
          },
          (error) => {
            console.error("Error in templates subscription:", error)
            // Don't call the callback here - we'll call it with default templates below
          },
        )
      } catch (error) {
        console.error("Error setting up templates subscription:", error)
        // Return empty array instead of failing - callback will be called with default templates below
      }
    } catch (error) {
      console.error("Error in templates subscription setup:", error)
      // Return empty array instead of failing - callback will be called with default templates below
    }

    // Always call the callback with an empty array to ensure the app continues to work
    // The app will use its default templates
    callback([])
  }

  setupSubscription()

  return () => {
    try {
      unsubscribe()
    } catch (error) {
      console.error("Error unsubscribing from templates:", error)
    }
  }
}

// Update the addTemplate function to properly handle permission errors
export const addTemplate = async (template: Omit<Template, "id" | "userId" | "createdAt">) => {
  try {
    const userId = await getCurrentUserId()
    const newTemplate = {
      ...template,
      userId,
      createdAt: serverTimestamp(),
    }
    const docRef = doc(templatesCollection)
    await setDoc(docRef, newTemplate)
    return {
      ...template,
      id: docRef.id,
      userId,
      createdAt: new Date().toISOString(),
    }
  } catch (error) {
    console.error("Error adding template:", error)
    // Return a local template object instead of throwing
    return {
      ...template,
      id: `local-${Date.now()}`,
      userId: "local",
      createdAt: new Date().toISOString(),
    }
  }
}

// Update the updateTemplate function to handle permission errors
export const updateTemplate = async (id: string, template: Partial<Template>) => {
  try {
    // Skip Firebase operations for local templates
    if (id.startsWith("local-") || id.startsWith("default-")) {
      return { success: true, local: true }
    }

    const templateRef = doc(templatesCollection, id)
    await updateDoc(templateRef, {
      ...template,
      updatedAt: serverTimestamp(),
    })
    return { success: true, local: false }
  } catch (error) {
    console.error("Error updating template:", error)
    return { success: false, local: true, error }
  }
}

// Update the deleteTemplate function to handle permission errors
export const deleteTemplate = async (id: string) => {
  try {
    // Skip Firebase operations for local templates
    if (id.startsWith("local-") || id.startsWith("default-")) {
      return { success: true, local: true }
    }

    await deleteDoc(doc(templatesCollection, id))
    return { success: true, local: false }
  } catch (error) {
    console.error("Error deleting template:", error)
    return { success: false, local: true, error }
  }
}
