import { useState } from 'react';
import css from './AddColumnModal.module.css';
import { useSelector } from 'react-redux';
import Loader from '../../Loader/Loader';

const AddColumnModal = ({ closeModal }) => {
  const currentUser = useSelector(state => state.auth.user);

  const [formData, setFormData] = useState({
    title: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = e => {
    setFormData(prev => ({ ...prev, title: e.target.value }));
    if (error) setError('');
  };

  return (
    <div className={css.contAddColumn}>
      <svg className={css.closeBtnSvg} onClick={closeModal}>
        <use href="/symbol-defs.svg#icon-x-close-1"></use>
      </svg>
      <h2 className={css.title}>Add column</h2>

      <form>
        {/* Board name */}
        <input
          type="text"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          className={css.input}
          style={error ? { borderColor: 'red', marginBottom: '2px' } : {}}
        />
        {error && <p className={css.error}>{error}</p>}

        <button
          type="submit"
          className={currentUser?.theme === 'Violet' ? css.addColumnBtnViolet : css.addColumntBtn}
        >
          <svg className={css.createBtnSvg}>
            <use
              href={
                currentUser?.theme === 'Violet'
                  ? '/symbol-defs.svg#icon-plus-4'
                  : '/symbol-defs.svg#icon-plus-1'
              }
            ></use>
          </svg>
          Add
        </button>
      </form>
      <Loader show={isLoading} />
    </div>
  );
};

export default AddColumnModal;
