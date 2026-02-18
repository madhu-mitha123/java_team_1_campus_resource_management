import { useState, useEffect } from "react";
import api from "../api/axiosConfig";

/**
 * Shared booking logic hook used by all booking pages.
 * @param {string} resourceType - e.g. "CLASSROOM", "LAB", "AUDITORIUM", etc.
 */
const useBooking = (resourceType) => {
    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;

    const [resources, setResources] = useState([]);
    const [selectedResource, setSelectedResource] = useState(null);
    const [selectedDate, setSelectedDate] = useState("");
    const [timeSlots, setTimeSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [loading, setLoading] = useState(false);
    const [slotsLoading, setSlotsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        if (user) fetchResources();
    }, []);

    const fetchResources = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await api.get(`/api/resources/by-role?userId=${user.id}`);
            const filtered = resourceType
                ? res.data.filter((r) => r.type === resourceType)
                : res.data;
            setResources(filtered);
        } catch (err) {
            if (err.response?.status === 404) setError("No resources found for your account.");
            else if (err.response?.status === 400) setError(err.response.data?.message || "Bad request.");
            else setError("Network error. Could not load resources.");
        } finally {
            setLoading(false);
        }
    };

    const fetchSlots = async (resourceId, date) => {
        setSlotsLoading(true);
        setTimeSlots([]);
        setError("");
        try {
            const res = await api.get(`/api/timeslots?resourceId=${resourceId}&date=${date}`);
            setTimeSlots(res.data);
        } catch (err) {
            if (err.response?.status === 404) setTimeSlots([]);
            else setError("Could not load time slots. Please try again.");
        } finally {
            setSlotsLoading(false);
        }
    };

    const handleResourceSelect = (resource) => {
        setSelectedResource(resource);
        setSelectedSlot(null);
        setTimeSlots([]);
        setSuccess("");
        setError("");
        if (selectedDate) fetchSlots(resource.id, selectedDate);
    };

    const handleDateChange = (e) => {
        const date = e.target.value;
        setSelectedDate(date);
        setSelectedSlot(null);
        setSuccess("");
        setError("");
        if (selectedResource) fetchSlots(selectedResource.id, date);
    };

    const handleConfirm = async () => {
        setError("");
        setSuccess("");

        if (!selectedResource || !selectedDate || !selectedSlot) {
            setError("Please select a resource, date, and time slot.");
            return;
        }

        try {
            await api.post("/api/bookings", {
                userId: user.id,
                resourceId: selectedResource.id,
                slotId: selectedSlot.id,
                date: selectedDate,
            });
            setSuccess("✅ Booking submitted! Awaiting admin approval.");
            setSelectedSlot(null);
            fetchSlots(selectedResource.id, selectedDate);
        } catch (err) {
            if (err.response) {
                const msg =
                    typeof err.response.data === "string"
                        ? err.response.data
                        : err.response.data?.message || "Booking failed.";
                setError(msg);
            } else {
                setError("Network error. Please check your connection.");
            }
        }
    };

    return {
        user,
        resources,
        selectedResource,
        selectedDate,
        timeSlots,
        selectedSlot,
        loading,
        slotsLoading,
        error,
        success,
        setSelectedSlot,
        handleResourceSelect,
        handleDateChange,
        handleConfirm,
        setError,
        setSuccess,
    };
};

export default useBooking;
