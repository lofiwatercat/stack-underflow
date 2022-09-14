import { useState, useEffect } from 'react';
import { useParams, Redirect, Link, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getQuestion , fetchQuestion, createQuestion, updateQuestion} from '../../store/questions';
import { getCurrentUser } from '../../store/session';
import './QuestionForm.scss'

const QuestionForm = () => {
  const dispatch = useDispatch();
  const { questionId } = useParams();
  const [errors, setErrors] = useState([]);

  const type = typeof(questionId) === 'string' ? "Update Question" : "Create Question";
  let typeText = "Edit Question";
  if (type === "Create Question") {
    typeText = "Ask a public question"
  }

  useEffect(() => {
    if (questionId) {
      dispatch(fetchQuestion(questionId))
    }
  }, [questionId]);

  // Set datafields of the question
  let questionData = useSelector(getQuestion(questionId));
  if (!questionData) {
    questionData = {id: questionId, title: "", body: "", authorId: ''}
  }

  questionData.authorId = useSelector(getCurrentUser()).id

  const [question, setQuestion] = useState(questionData)

  let history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (type === 'Create Question') {
      // If res is successful, we go to the show page
      const resNData = await dispatch(createQuestion(question));
      const res = resNData.res;
      const data = resNData.data;
      if (res.ok === true) {
        history.push(`/questions/${data.question.id}`);
      }
    } else {
      dispatch(updateQuestion(question))
      history.push(`/questions/${questionId}`);
    }
  };

  console.log(question)

  return (
    <div id="questionFormPage">
        <h1>{typeText}</h1>
        <div id="questionFormAndGuide">
          <div id="questionFormContainer">
          <form id="questionForm" onSubmit={handleSubmit}>
            <label>Title</label>
              <p>Be specific and imagine you're asking a question to another person</p>
              <input id="title" value={question.title} onChange={e => setQuestion({...question, title: e.target.value})} />
            <label>Body</label>
              <p>Include all the information someone would need to answer your question</p>
              <textarea value={question.body} onChange={e => setQuestion({...question, body: e.target.value})} />
            <input id="createQuestionButton" type={'submit'} value={typeText}/>
          </form>
        </div>
      <div id="questionGuidelines">
          <p>TODOOOOOO</p>
          <p>Step 1, draft your question</p>
      </div>
      </div>
    </div>
  )
}

export default QuestionForm;