
async function deleteWorkout(workoutId) {
    if (confirm("Delete workout?") == true) {
        const response = await fetch("/workouts/" + workoutId, {
            method: 'DELETE'
        })
        if (response.status === 200) location.replace("/")
    }
}