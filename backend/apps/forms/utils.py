from .models import Question

def change_question_position(
  ascending,
  index,
  form_questions,
  existing_positions,
  updated_question,
  updated_question_old_position,
  updated_question_new_position
):
  this_question = form_questions[index]
  this_position = existing_positions[index]
  if this_position == updated_question_old_position:
    setattr(updated_question, "position", updated_question_new_position)
    setattr(this_question, "position", updated_question_old_position)
  else:
    skip = 1 if ascending else -1
    new_position = this_position + skip
    if new_position in existing_positions:
      change_question_position(
        ascending
        index=index + skip,
        form_questions,
        existing_positions,
        updated_question,
        updated_question_old_position,
        updated_question_new_position
      )
      setattr(this_question, "position", new_position)
    else:
      setattr(this_question, "position", new_position)
      setattr(updated_question, "position", updated_question_new_position)


"""
Takes in a question along with a new position
Adjusts positions of questions between the old and new positions
Then updates the question with its new position
"""
def insert_question(question, new_position):
  old_position = question.position
  if old_position == new_position:
    return
  move_fowards = old_position < new_position
  form_questions = question.form.questions.filter(
    position__lte=(new_position if move_back else old_position),
    position__gte=(old_position if move_back else new_position)
  )
  existing_positions = form_questions.values_list("position", flat=True)
  questions_length = len(form_questions)
  if move_forwards:
    if existing_positions[0] != new_position:
      setattr(question, "position", new_position)
      return
    for i in range(questions_length):
      
  else:
    if existing_positions[questions_length - 1] != new_position:
      setattr(question, "position", new_position)
      return
    for i in range(questions_length, 0, -1):


""" def insert_question(question, new_position):
  old_position = question.position
  ascending: bool = old_position < new_position
  form_questions = question.form.questions.filter(
    position__lte=(new_position if ascending else old_position),
    position__gte=(old_position if ascending else new_position)
  )
  existing_positions = form_questions.values_list("position", flat=True)
  if new_position in existing_positions:
    change_question_position(
      ascending,
      index=existing_positions.index(new_position),
      form_questions,
      existing_positions,
      updated_question=question,
      updated_question_old_position=old_position,
      updated_question_new_position=new_position
    )
    Question.objects.bulk_update(form_questions)
  else:
    setattr(question, "position", new_position) """
