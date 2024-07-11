import React, { useState, useEffect } from 'react';
import Header from './Header';
import Modal from './Modal';
import './Note.css';

const NewTask = () => {
    const [notes, setNotes] = useState(() => {
        const storedNotes = JSON.parse(localStorage.getItem('notes')) || [];
        return storedNotes;
    });

    const [filteredNotes, setFilteredNotes] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [modalNote, setModalNote] = useState(null);
    const [modalMode, setModalMode] = useState('add'); 
    const [editNoteId, setEditNoteId] = useState(null); 
    const [newNoteTitle, setNewNoteTitle] = useState('');
    const [newNoteContent, setNewNoteContent] = useState('');
    const [newNoteCategory, setNewNoteCategory] = useState('General');
    const [validationError, setValidationError] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [noteToDelete, setNoteToDelete] = useState(null);
    const [showReadMoreModal, setShowReadMoreModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const [notesPerPage] = useState(8);

    useEffect(() => {
        localStorage.setItem('notes', JSON.stringify(notes));
    }, [notes]);

    useEffect(() => {
        setFilteredNotes(notes);
    }, [notes]);

    const indexOfLastNote = currentPage * notesPerPage;
    const indexOfFirstNote = indexOfLastNote - notesPerPage;
    const currentNotes = filteredNotes.slice(indexOfFirstNote, indexOfLastNote);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const openAddNoteModal = () => {
        setModalMode('add');
        setShowModal(true);
    };

    const openEditNoteModal = (id) => {
        const noteToEdit = notes.find((note) => note.id === id);
        if (noteToEdit) {
            setEditNoteId(id);
            setNewNoteTitle(noteToEdit.title);
            setNewNoteContent(noteToEdit.content);
            setNewNoteCategory(noteToEdit.category);
            setModalMode('edit');
            setShowModal(true);
        }
    };

    const handleAddNote = () => {
        if (!newNoteTitle.trim() || !newNoteContent.trim()) {
            setValidationError('Title and content are required.');
            return;
        }

        if (modalMode === 'add') {
            const newNote = {
                id: notes.length > 0 ? notes[0].id + 1 : 1,
                title: newNoteTitle,
                content: newNoteContent,
                category: newNoteCategory
            };
            setNotes([newNote, ...notes]);
        } else if (modalMode === 'edit' && editNoteId !== null) {
            const updatedNotes = notes.map((note) =>
                note.id === editNoteId ? { ...note, title: newNoteTitle, content: newNoteContent, category: newNoteCategory } : note
            );
            setNotes(updatedNotes);
        }

        resetForm();
    };

    const resetForm = () => {
        setNewNoteTitle('');
        setNewNoteContent('');
        setNewNoteCategory('General');
        setValidationError('');
        setEditNoteId(null);
        setShowModal(false);
    };

    const confirmDelete = (id) => {
        const noteToDelete = notes.find((note) => note.id === id);
        if (noteToDelete) {
            setNoteToDelete(noteToDelete);
            setShowDeleteModal(true);
        }
    };

    const handleDeleteNote = () => {
        if (noteToDelete) {
            const updatedNotes = notes.filter((note) => note.id !== noteToDelete.id);
            setNotes(updatedNotes);
            setShowDeleteModal(false);
        }
    };

    const cancelDelete = () => {
        setShowDeleteModal(false);
        setNoteToDelete(null);
    };

    const openViewModal = (note) => {
        setModalNote(note);
        setShowModal(true);
    };

    const openReadMoreModal = (note) => {
        setModalNote(note);
        setShowReadMoreModal(true);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        filterNotes(e.target.value, selectedCategory);
    };


    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
        filterNotes(searchTerm, e.target.value);
    };

    const filterNotes = (searchTerm, category) => {
        let filtered = notes.filter((note) => {
            const titleMatch = note.title.toLowerCase().includes(searchTerm.toLowerCase());
            const categoryMatch = category === 'All' || note.category === category;
            return titleMatch && categoryMatch;
        });
        setFilteredNotes(filtered);
        setCurrentPage(1); 
    };

    return (
        <>
            <Header />
            <div className="add-note-container">
                <button className="add-note-btn" onClick={openAddNoteModal}>Add Note</button>
                {currentNotes.length > 0 && <div className="search-filter">
                    <input
                        type="text"
                        placeholder="Search by title..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                    <select value={selectedCategory} onChange={handleCategoryChange}>
                        <option value="All">All Categories</option>
                        <option value="General">General</option>
                        <option value="Work">Work</option>
                        <option value="Personal">Personal</option>
                        <option value="Study">Study</option>
                    </select>
                </div>}
            </div>
            <div className="note-list">
                {currentNotes.length > 0 ? (
                    currentNotes.map((note) => (
                        <div className="note" key={note.id}>
                            <h2>{note.title}</h2>
                            <p>{note.content.length > 200 ? `${note.content.substring(0, 200)}...` : note.content}</p>
                            <button className="read-more-btn" onClick={() => openReadMoreModal(note)}>Read More</button>
                            <button onClick={() => confirmDelete(note.id)}>Delete</button>
                            <button onClick={() => openEditNoteModal(note.id)}>Edit</button>
                        </div>
                    ))
                ) : (
                    <div className="no-notes-container">
                        <p className="no-notes-message">No notes available. Start adding some notes!</p>
                    </div>
                )}
            </div>

         {currentNotes.length > 0 &&
            <div className="pagination">
                <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
                <span>{currentPage}</span>
                <button onClick={() => paginate(currentPage + 1)} disabled={currentNotes.length < notesPerPage}>Next</button>
            </div>
        }
            
            <Modal
                showModal={showModal}
                closeModal={() => setShowModal(false)}
                title={modalMode === 'add' ? 'Add Note' : 'Edit Note'}
            >
                <form onSubmit={handleAddNote}>
                    <div className="form-group">
                        <label htmlFor="note-title">Title</label>
                        <input
                            type="text"
                            id="note-title"
                            value={newNoteTitle}
                            onChange={(e) => setNewNoteTitle(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="note-content">Content</label>
                        <textarea
                            id="note-content"
                            value={newNoteContent}
                            onChange={(e) => setNewNoteContent(e.target.value)}
                            required
                        ></textarea>
                    </div>
                    <div className="form-group">
                        <label htmlFor="note-category">Category</label>
                        <select
                            id="note-category"
                            value={newNoteCategory}
                            onChange={(e) => setNewNoteCategory(e.target.value)}
                        >
                            <option value="General">General</option>
                            <option value="Work">Work</option>
                            <option value="Personal">Personal</option>
                            <option value="Study">Study</option>
                            
                        </select>
                    </div>
                    {validationError && <p className="error-msg">{validationError}</p>}
                    <div className="modal-buttons">
                        <button type="submit">{modalMode === 'add' ? 'Add' : 'Save'}</button>
                        <button type="button" onClick={resetForm}>Cancel</button>
                    </div>
                </form>
            </Modal>

           
            <Modal
                showModal={showDeleteModal}
                closeModal={cancelDelete}
                title="Confirm Delete"
            >
                <p>Are you sure you want to delete the note titled: <strong>{noteToDelete ? noteToDelete.title : ''}</strong>?</p>
                <div className="modal-buttons">
                    <button onClick={handleDeleteNote}>Delete</button>
                    <button onClick={cancelDelete}>Cancel</button>
                </div>
            </Modal>

            <Modal
                showModal={showReadMoreModal}
                closeModal={() => setShowReadMoreModal(false)}
                title="Note Details"
            >
                {modalNote && (
                    <>
                        <h3>{modalNote.title}</h3>
                        <p><strong>Category:</strong> {modalNote.category}</p>
                        <p>{modalNote.content}</p>
                    </>
                )}
            </Modal>
        </>
    );
};

export default NewTask;
