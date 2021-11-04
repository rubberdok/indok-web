from .models import Attendable, SlotDistribution


def create_attendable(attendable_data, event):
    if (
        hasattr(attendable_data, "price")
        and attendable_data.price != None
        and hasattr(attendable_data, "binding_signup")
        and attendable_data.binding_signup == False
    ):
        raise ValueError("Betalt påmelding krever bindende påmelding")

    attendable = Attendable()
    for k, v in attendable_data.items():
        setattr(attendable, k, v)
    setattr(attendable, "event", event)
    attendable.save()
    return attendable


def create_slot_distributions(slot_distribution_data, attendable):
    child_dists = []

    # Create parent distribution
    grade_dist_data = (
        slot_distribution_data.pop("grade_years") if hasattr(slot_distribution_data, "grade_years") else None
    )

    slot_distribution = SlotDistribution()
    for k, v in slot_distribution_data.items():
        setattr(slot_distribution, k, v)
    setattr(slot_distribution, "attendable", attendable)

    # Create child distributions if different grades have a specififc number of slots
    if grade_dist_data is not None and len(grade_dist_data) > 0:
        total_grades_allowed = ""
        total_child_slots = 0
        for dist in grade_dist_data:
            total_grades_allowed += dist.category + ","
            total_child_slots += dist.available_slots
            child = SlotDistribution.objects.create(
                attendable=attendable, available_slots=dist.available_slots, grade_years=dist.category
            )
            child_dists.append(child)
        total_grades_allowed = total_grades_allowed[:-1]
        listed_total_grades_allowed = [int(val) for val in total_grades_allowed.split(",")]
        if len(set(listed_total_grades_allowed)) != len(listed_total_grades_allowed):
            raise ValueError("Samme trinn kan ikke være i flere 'Antall plasser'-kategorier")
        if total_child_slots != slot_distribution.available_slots:
            raise ValueError("Totalt antall plasser stemmer ikke overens med fordelingen av plasser")
        setattr(slot_distribution, "grade_years", total_grades_allowed)
        setattr(slot_distribution, "available_slots", total_child_slots)

    slot_distribution.save()
    for child in child_dists:
        setattr(child, "parent_distribution", slot_distribution)
        child.save()

    return slot_distribution


def update_slot_distributions(slot_distribution_data, slot_distribution, has_grade_distributions):
    grade_dist_data = (
        slot_distribution_data.pop("grade_years") if hasattr(slot_distribution_data, "grade_years") else None
    )
    # Update parent distribution
    for k, v in slot_distribution_data.items():
        setattr(slot_distribution, k, v)
    slot_distribution.save()

    # Update child distributions
    if grade_dist_data is not None and len(grade_dist_data) > 0:
        children = list(slot_distribution.child_distributions.all())
        current_no_of_categories = len(children)
        no_of_new_categories = len(grade_dist_data)

        # Number of distributions is the same or fewer, must remove children if fewer and then update their values
        if current_no_of_categories >= no_of_new_categories:
            for _ in range(current_no_of_categories - no_of_new_categories):
                child = children.pop()
                child.delete()

            total_grades_allowed = ""
            total_child_slots = 0
            for dist in grade_dist_data:
                total_grades_allowed += dist.category + ","
                total_child_slots += dist.available_slots
                child = children.pop()
                setattr(child, "available_slots", dist.available_slots)
                setattr(child, "grade_years", dist.category)
                child.save()

        else:  # Number of distributions has increased, must add  children
            total_grades_allowed = ""
            total_child_slots = 0
            for dist in grade_dist_data[:current_no_of_categories]:
                total_grades_allowed += dist.category + ","
                total_child_slots += dist.available_slots
                child = children.pop()
                setattr(child, "available_slots", dist.available_slots)
                setattr(child, "grade_years", dist.category)
                child.save()

            for dist in grade_dist_data[current_no_of_categories:]:
                total_grades_allowed += dist.category + ","
                total_child_slots += dist.available_slots
                child = SlotDistribution.objects.create(
                    attendable=slot_distribution.attendable,
                    available_slots=dist.available_slots,
                    grade_years=dist.category,
                    parent_distribution=slot_distribution,
                )
                child.save()

        total_grades_allowed = total_grades_allowed[:-1]
        listed_total_grades_allowed = [int(val) for val in total_grades_allowed.split(",")]
        if len(set(listed_total_grades_allowed)) != len(listed_total_grades_allowed):
            raise ValueError("Samme trinn kan ikke være i flere 'Antall plasser'-kategorier")

        setattr(slot_distribution, "grade_years", total_grades_allowed)
        setattr(slot_distribution, "available_slots", total_child_slots)
        slot_distribution.save()

    if (
        len(list(slot_distribution.child_distributions.all())) > 0 and not has_grade_distributions
    ):  # No longer using categorical slot distributions, must delete all child distributions
        for child in slot_distribution.child_distributions.all():
            child.delete()

    return slot_distribution
