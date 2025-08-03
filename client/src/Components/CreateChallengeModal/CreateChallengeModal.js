import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import './CreateChallengeModal.css';

const CreateChallengeModal = ({ onClose, onCreate }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        challengeType: 'strength',
        targetValue: '',
        targetUnit: 'lbs',
        duration: '',
        maxParticipants: 50,
        eloReward: 50,
        eloPenalty: 25,
        requiresProof: true
    });

    const user = useSelector((state) => state.authReducer.authData);

    const challengeTypes = [
        { value: 'strength', label: '💪 Strength', units: ['lbs', 'kg', 'reps'] },
        { value: 'endurance', label: '🏃‍♂️ Endurance', units: ['miles', 'km', 'minutes'] },
        { value: 'consistency', label: '📅 Consistency', units: ['days', 'workouts'] },
        { value: 'weight_loss', label: '⚖️ Weight Loss', units: ['lbs', 'kg', '%'] },
        { value: 'personal_record', label: '🏆 Personal Record', units: ['lbs', 'kg', 'reps'] }
    ];

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleTypeChange = (e) => {
        const selectedType = challengeTypes.find(type => type.value === e.target.value);
        setFormData(prev => ({
            ...prev,
            challengeType: e.target.value,
            targetUnit: selectedType.units[0] // Set default unit for selected type
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const challengeData = {
            ...formData,
            creator: user._id,
            target: {
                value: parseFloat(formData.targetValue),
                unit: formData.targetUnit
            },
            duration: parseInt(formData.duration),
            maxParticipants: parseInt(formData.maxParticipants),
            eloReward: parseInt(formData.eloReward),
            eloPenalty: parseInt(formData.eloPenalty)
        };

        try {
            const response = await fetch('http://localhost:4000/challenge', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify(challengeData)
            });

            if (response.ok) {
                onCreate(); // Refresh challenges list
                onClose(); // Close modal
                alert('Challenge created successfully!');
            } else {
                alert('Failed to create challenge');
            }
        } catch (error) {
            console.error('Error creating challenge:', error);
            alert('Error creating challenge');
        }
    };

    const selectedType = challengeTypes.find(type => type.value === formData.challengeType);

    return (
        <div className="modal-overlay">
            <div className="create-challenge-modal">
                <div className="modal-header">
                    <h2>⚔️ Create New Challenge</h2>
                    <button className="close-btn" onClick={onClose}>✕</button>
                </div>

                <form onSubmit={handleSubmit} className="challenge-form">
                    <div className="form-group">
                        <label>Challenge Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            placeholder="e.g., 30-Day Squat Challenge"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="Describe your challenge..."
                            rows="3"
                            required
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Challenge Type</label>
                            <select
                                name="challengeType"
                                value={formData.challengeType}
                                onChange={handleTypeChange}
                                required
                            >
                                {challengeTypes.map(type => (
                                    <option key={type.value} value={type.value}>
                                        {type.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Duration (days)</label>
                            <input
                                type="number"
                                name="duration"
                                value={formData.duration}
                                onChange={handleInputChange}
                                min="1"
                                max="365"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Target Value</label>
                            <input
                                type="number"
                                name="targetValue"
                                value={formData.targetValue}
                                onChange={handleInputChange}
                                min="0"
                                step="0.1"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Unit</label>
                            <select
                                name="targetUnit"
                                value={formData.targetUnit}
                                onChange={handleInputChange}
                                required
                            >
                                {selectedType.units.map(unit => (
                                    <option key={unit} value={unit}>{unit}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Max Participants</label>
                            <input
                                type="number"
                                name="maxParticipants"
                                value={formData.maxParticipants}
                                onChange={handleInputChange}
                                min="2"
                                max="1000"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>ELO Reward</label>
                            <input
                                type="number"
                                name="eloReward"
                                value={formData.eloReward}
                                onChange={handleInputChange}
                                min="10"
                                max="200"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group checkbox-group">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                name="requiresProof"
                                checked={formData.requiresProof}
                                onChange={handleInputChange}
                            />
                            <span className="checkmark"></span>
                            Require photo/video proof for submissions
                        </label>
                    </div>

                    <div className="form-actions">
                        <button type="button" className="cancel-btn" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="create-btn">
                            Create Challenge
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateChallengeModal;
