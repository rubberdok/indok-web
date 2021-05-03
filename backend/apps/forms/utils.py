from .models import Question

"""
Takes in a question along with a new position
Adjusts positions of questions between the old and new positions
Then updates the question with its new position
"""
def update_question_position(question, new_position):
  old_position = question.position

  # If question position has not changed, return
  if old_position == new_position:
    return

  # Determine whether question is moving forwards (decreasing position) or back (increasing position)
  move_forwards = new_position < old_position

  # Get the questions in the form between the updated question's old and new positions
  questions_between = question.form.questions.filter(
    position__lte=(old_position if move_forwards else new_position),
    position__gte=(new_position if move_forwards else old_position)
  )
  positions_between = questions_between.values_list("position", flat=True)
  number_of_questions_between = len(questions_between)

  changed_questions = []

  setattr(question, "position", new_position)

  if move_forwards:
    # If new position is not taken, return
    if positions_between[0] != new_position:
      return

    # Loop through question indices except the last one, as that is the updated question
    for i in range(number_of_questions_between - 1):
      # Increment positions of questions between the new and old positions of the updated question
      setattr(questions_between[i], "position", positions_between[i] + 1)
      changed_questions.append(questions_between[i])

      # If there is available space before next position, then all questions now have unique positions
      if (positions_between[i + 1] != positions_between[i] + 1):
        break

  else:
    # If new position is not taken, return (since we're moving backwards, this is now the last question)
    if positions_between[questions_length - 1] != new_position:
      return

    # Loop through question indices except the first one, as that is the updated question
    for i in range(number_of_questions_between, 1, -1):
      # Decrement positions of questions between the old and new positions of the updated question
      setattr(questions_between[i], "position", positions_between[i] - 1)
      changed_questions.append(questions_between[i])

      # If there is available space before next position, then all questions now have unique positions
      if (positions_between[i - 1] != positions_between[i] - 1):
        break

  for changed_question in reversed(changed_questions):
    changed_question.save()
