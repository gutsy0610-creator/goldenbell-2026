import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ChevronLeft, ChevronRight, RotateCw, Shuffle, Play, FastForward } from 'lucide-react';
import questionsDataRaw from '../data/questions.json';

const Flashcards = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [isRandomMode, setIsRandomMode] = useState(false);
  const [savedIndex, setSavedIndex] = useState(0);

  useEffect(() => {
    const validQuestions = questionsDataRaw.filter(q => q.answer && q.answer.trim() !== '');
    setQuestions(validQuestions);
    
    const lastIdx = parseInt(localStorage.getItem('last_flashcard_index') || '0', 10);
    if (lastIdx > 0 && lastIdx < validQuestions.length) {
      setSavedIndex(lastIdx);
    }
  }, []);

  const handleStartSequential = (startIndex = 0) => {
    const validQuestions = questionsDataRaw.filter(q => q.answer && q.answer.trim() !== '');
    setQuestions(validQuestions);
    setCurrentIndex(startIndex);
    setIsRandomMode(false);
    setHasStarted(true);
  };

  const handleStartRandom = () => {
    const shuffled = [...questions].sort(() => 0.5 - Math.random());
    setQuestions(shuffled);
    setCurrentIndex(0);
    setIsRandomMode(true);
    setHasStarted(true);
  };

  const currentQ = questions[currentIndex];

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
      const nextIndex = (currentIndex + 1) % questions.length;
      setCurrentIndex(nextIndex);
      if (!isRandomMode) {
        localStorage.setItem('last_flashcard_index', nextIndex.toString());
      }
    }, 150);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setTimeout(() => {
      const prevIndex = (currentIndex - 1 + questions.length) % questions.length;
      setCurrentIndex(prevIndex);
      if (!isRandomMode) {
        localStorage.setItem('last_flashcard_index', prevIndex.toString());
      }
    }, 150);
  };

  if (!hasStarted) {
    return (
      <div className="quiz-container" style={{ textAlign: 'center', paddingTop: '40px' }}>
        <button className="btn btn-outline" style={{ position: 'absolute', top: '20px', left: '20px', padding: '8px 16px' }} onClick={() => navigate('/')}>
          <ArrowLeft size={16} /> 나가기
        </button>
        
        <h2 style={{ fontSize: '2.5rem', color: 'var(--primary-dark)', marginBottom: '10px' }}>플래시카드 학습</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '40px' }}>어떤 방식으로 학습을 시작할까요?</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '400px', margin: '0 auto' }}>
          {savedIndex > 0 && (
            <button 
              className="btn btn-primary" 
              style={{ padding: '20px', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
              onClick={() => handleStartSequential(savedIndex)}
            >
              <FastForward size={24} /> 이어서 학습하기 ({savedIndex + 1}번부터)
            </button>
          )}
          
          <button 
            className={`btn ${savedIndex > 0 ? 'btn-outline' : 'btn-primary'}`} 
            style={{ padding: '20px', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
            onClick={() => handleStartSequential(0)}
          >
            <Play size={24} /> 처음부터 시작하기
          </button>
          
          <button 
            className="btn btn-outline" 
            style={{ padding: '20px', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', background: '#F8F9FA' }}
            onClick={handleStartRandom}
          >
            <Shuffle size={24} /> 랜덤으로 섞어서 학습하기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <button className="btn btn-outline" style={{ padding: '8px 16px', fontSize: '0.9rem' }} onClick={() => { setHasStarted(false); setIsFlipped(false); }}>
          <ArrowLeft size={16} /> 메뉴로
        </button>
        <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--primary-dark)' }}>
          {isRandomMode ? '랜덤 플래시카드' : '순차 플래시카드'}
        </div>
        <div style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>
          {currentIndex + 1} / {questions.length}
        </div>
      </div>

      <div className="progress-bar-container" style={{ marginTop: '10px' }}>
        <div 
          className="progress-bar-fill" 
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      <div style={{ perspective: '1000px', margin: '30px 0', height: '400px' }}>
        <motion.div
          onClick={() => setIsFlipped(!isFlipped)}
          initial={false}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, type: 'spring', stiffness: 260, damping: 20 }}
          style={{
            width: '100%',
            height: '100%',
            position: 'relative',
            transformStyle: 'preserve-3d',
            cursor: 'pointer'
          }}
        >
          {/* Front (Question) */}
          <div style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            background: 'linear-gradient(135deg, #A29BFE 0%, #6C5CE7 100%)',
            borderRadius: '24px',
            padding: '40px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'white',
            boxShadow: '0 15px 35px rgba(108, 92, 231, 0.3)',
            textAlign: 'center'
          }}>
            <div style={{ position: 'absolute', top: '20px', left: '20px', fontSize: '0.9rem', opacity: 0.8 }}>
              {isRandomMode ? '랜덤 문제' : `문제 ${currentIndex + 1}`}
            </div>
            <div style={{ position: 'absolute', top: '20px', right: '20px', fontSize: '0.8rem', opacity: 0.6 }}>
              출처: {currentQ?.source.replace('.txt', '')}
            </div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: '800', lineHeight: '1.5', textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              {currentQ?.question}
            </h2>
            <div style={{ position: 'absolute', bottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.8, fontSize: '0.9rem' }}>
              <RotateCw size={16} /> 탭하여 정답 보기
            </div>
          </div>

          {/* Back (Answer) */}
          <div style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            background: 'white',
            borderRadius: '24px',
            padding: '40px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'var(--text-main)',
            boxShadow: '0 15px 35px rgba(0,0,0,0.1)',
            transform: 'rotateY(180deg)',
            textAlign: 'center',
            border: '2px solid var(--primary-light)'
          }}>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '20px' }}>정답</h3>
            <div style={{ fontSize: '2.2rem', fontWeight: '900', color: 'var(--primary-dark)', wordBreak: 'keep-all' }}>
              {currentQ?.answer || '(정답 없음)'}
            </div>
          </div>
        </motion.div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
        <button className="btn btn-outline" onClick={handlePrev} style={{ borderRadius: '50%', width: '60px', height: '60px', padding: 0 }}>
          <ChevronLeft size={24} />
        </button>
        <button className="btn btn-primary" onClick={handleNext} style={{ borderRadius: '50%', width: '60px', height: '60px', padding: 0, boxShadow: '0 10px 20px rgba(108, 92, 231, 0.4)' }}>
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
};

export default Flashcards;
