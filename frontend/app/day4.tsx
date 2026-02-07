import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
  Modal,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { api } from "../utils/api";

const { width } = Dimensions.get("window");

const LOVE_QUIZ = [
  {
    question: "What is considered the 'love hormone'?",
    options: ["Dopamine", "Oxytocin", "Serotonin", "Adrenaline"],
    correct: 1,
    fact: "Oxytocin is released during hugs, kisses, and cuddles!"
  },
  {
    question: "How long does it take to fall in love?",
    options: ["1 week", "1 month", "1/5th of a second", "1 year"],
    correct: 2,
    fact: "Science says it takes just 1/5th of a second to fall in love!"
  },
  {
    question: "What percentage of the body is made up when you hug someone?",
    options: ["One complete heart", "Two halves", "Infinite connection", "Perfect match"],
    correct: 0,
    fact: "When you hug, your hearts sync up creating one rhythm!"
  },
  {
    question: "Couples who do this together are happier:",
    options: ["Watch TV", "Cook together", "Laugh together", "All of the above"],
    correct: 3,
    fact: "Shared activities strengthen bonds and create lasting memories!"
  },
  {
    question: "The ancient Greeks had how many words for love?",
    options: ["1", "4", "8", "12"],
    correct: 2,
    fact: "Ancient Greeks recognized 8 different types of love!"
  },
];

export default function Day4() {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showFact, setShowFact] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    
    if (answerIndex === LOVE_QUIZ[currentQuestion].correct) {
      setScore(score + 1);
    }
    
    setShowFact(true);
    
    setTimeout(() => {
      if (currentQuestion + 1 < LOVE_QUIZ.length) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setShowFact(false);
      } else {
        setTimeout(() => {
          completeDay();
        }, 500);
      }
    }, 2500);
  };

  const completeDay = async () => {
    try {
      await api.completeDay(4);
      setShowResult(true);
    } catch (error) {
      console.error("Failed to complete day:", error);
      Alert.alert("Error", "Failed to save progress");
    }
  };

  const handleContinue = () => {
    router.push("/");
  };

  const isCorrect = selectedAnswer === LOVE_QUIZ[currentQuestion].correct;

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#1a1a1a", "#2d0a1f"]} style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="#FFC0CB" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>🧸 Teddy Day</Text>
        <Text style={styles.progress}>
          Question {currentQuestion + 1} / {LOVE_QUIZ.length}
        </Text>
      </LinearGradient>

      <ScrollView style={styles.gameContainer} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.instructions}>Love & Relationship Quiz! 💕</Text>
        <Text style={styles.scoreText}>Score: {score} / {LOVE_QUIZ.length}</Text>

        <View style={styles.questionContainer}>
          <Text style={styles.questionText}>
            {LOVE_QUIZ[currentQuestion].question}
          </Text>

          <View style={styles.optionsContainer}>
            {LOVE_QUIZ[currentQuestion].options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionButton,
                  selectedAnswer === index && isCorrect && styles.correctOption,
                  selectedAnswer === index && !isCorrect && styles.wrongOption,
                ]}
                onPress={() => handleAnswer(index)}
                disabled={selectedAnswer !== null}
              >
                <LinearGradient
                  colors={
                    selectedAnswer === index && isCorrect
                      ? ["#4CAF50", "#45a049"]
                      : selectedAnswer === index && !isCorrect
                      ? ["#f44336", "#da190b"]
                      : ["#3d1a2e", "#2d0a1f"]
                  }
                  style={styles.optionGradient}
                >
                  <Text style={styles.optionText}>{option}</Text>
                  {selectedAnswer === index && isCorrect && (
                    <Ionicons name="checkmark-circle" size={24} color="#FFFFFF" />
                  )}
                  {selectedAnswer === index && !isCorrect && (
                    <Ionicons name="close-circle" size={24} color="#FFFFFF" />
                  )}
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>

          {showFact && (
            <View style={styles.factContainer}>
              <Text style={styles.factTitle}>💡 Fun Fact:</Text>
              <Text style={styles.factText}>
                {LOVE_QUIZ[currentQuestion].fact}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Result Modal */}
      <Modal visible={showResult} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <LinearGradient
            colors={["#FFC0CB", "#FF85B3"]}
            style={styles.resultContainer}
          >
            <Text style={styles.resultEmoji}>🧸✨</Text>
            <Text style={styles.resultTitle}>Teddy Day Complete!</Text>
            <Text style={styles.quizScore}>
              You scored {score} out of {LOVE_QUIZ.length}!
            </Text>
            <Text style={styles.quoteText}>
              happy teddy day to my living, breathing, tall, musuclar, charming teddy :)
            </Text>
            <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
              <Text style={styles.continueButtonText}>Continue</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  backButton: {
    position: "absolute",
    left: 20,
    top: 50,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFC0CB",
  },
  progress: {
    fontSize: 18,
    color: "#FFD1DC",
    fontWeight: "600",
    marginTop: 8,
  },
  gameContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  instructions: {
    fontSize: 20,
    color: "#FFB6C1",
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 10,
  },
  scoreText: {
    fontSize: 16,
    color: "#FFC0CB",
    textAlign: "center",
    marginBottom: 30,
    fontWeight: "600",
  },
  questionContainer: {
    marginBottom: 30,
  },
  questionText: {
    fontSize: 22,
    color: "#FFFFFF",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 32,
  },
  optionsContainer: {
    gap: 16,
  },
  optionButton: {
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#FFC0CB",
  },
  correctOption: {
    borderColor: "#4CAF50",
  },
  wrongOption: {
    borderColor: "#f44336",
  },
  optionGradient: {
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  optionText: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "600",
    flex: 1,
  },
  factContainer: {
    marginTop: 30,
    padding: 20,
    backgroundColor: "rgba(255, 192, 203, 0.1)",
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#FFC0CB",
  },
  factTitle: {
    fontSize: 18,
    color: "#FFC0CB",
    fontWeight: "bold",
    marginBottom: 10,
  },
  factText: {
    fontSize: 16,
    color: "#FFD1DC",
    lineHeight: 24,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    alignItems: "center",
    justifyContent: "center",
  },
  resultContainer: {
    width: width * 0.85,
    padding: 32,
    borderRadius: 24,
    alignItems: "center",
  },
  resultEmoji: {
    fontSize: 80,
    marginBottom: 16,
  },
  resultTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 16,
    textAlign: "center",
  },
  quizScore: {
    fontSize: 20,
    color: "#FFFFFF",
    fontWeight: "bold",
    marginBottom: 20,
  },
  quoteText: {
    fontSize: 16,
    color: "#FFFFFF",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 24,
    fontStyle: "italic",
  },
  continueButton: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 40,
    paddingVertical: 14,
    borderRadius: 30,
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFC0CB",
  },
});