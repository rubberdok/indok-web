"""
Takes in a question along with a new position
Adjusts positions of questions between the old and new positions
Then updates the question with its new position
"""
def change_question_position(question, new_position):
  old_position = question.position
  form_questions = question.form.questions
  existing_positions = form_questions.values_list("position", flat=True)
  if new_position in existing_positions:
    
  else:
    setattr(question, "position", new_position)
  if old_position < new_position:
    for position in range(old_position, new_position):
      setattr(form_questions[position], "position", position - 1)
  elif old_position > new_position:
    for position in range(new_position, old_position):
      setattr(form_questions[position], "position", position + 1)
  else:
    return
  setattr(question, "position", new_position)
