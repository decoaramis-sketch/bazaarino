# encoding: UTF-8
require 'sketchup.rb'

module AramisMDFGroove
  GROOVE_WIDTH = 3.mm
  GROOVE_DEPTH = 8.mm

  def self.run
    model = Sketchup.active_model
    selection = model.selection
    edge = selection.grep(Sketchup::Edge).first

    unless edge && edge.valid?
      UI.messagebox("ابتدا یک لبه از سطح پشت MDF را انتخاب کن.")
      return
    end

    ents = model.active_entities
    unless edge.parent == ents
      UI.messagebox("اگر MDF داخل Group یا Component است، ابتدا وارد همان Group/Component شو و سپس لبه را انتخاب کن.")
      return
    end

    face = edge.faces.find { |f| f.valid? && f.plane }
    unless face
      UI.messagebox("برای این لبه یک سطح معتبر MDF پیدا نشد.")
      return
    end

    values = UI.inputbox(
      ["ضخامت MDF (میل‌متر):", "جهت شیار:"],
      ["16", "سمت اول"],
      ["", "سمت اول|سمت دوم"],
      "Aramis MDF Groove 3x8"
    )
    return unless values

    thickness_mm = values[0].to_f
    direction = values[1].to_s

    if thickness_mm <= 0
      UI.messagebox("ضخامت MDF باید بیشتر از صفر باشد.")
      return
    end

    p1 = edge.start.position
    p2 = edge.end.position
    edge_vector = p2 - p1
    if edge_vector.length <= 0.1.mm
      UI.messagebox("لبه انتخاب‌شده خیلی کوتاه است.")
      return
    end
    edge_vector.normalize!

    # Vector lying on the selected MDF face and perpendicular to the edge.
    side = edge_vector.cross(face.normal)
    if side.length <= 0.001.mm
      UI.messagebox("جهت شیار قابل تشخیص نیست.")
      return
    end
    side.normalize!
    side.reverse! if direction == "سمت دوم"

    # The groove CENTER is exactly one MDF thickness away from the selected edge.
    # Therefore 16 mm MDF => 16 mm center offset, 18 mm MDF => 18 mm center offset.
    center_offset = thickness_mm.mm
    half_width = GROOVE_WIDTH / 2.0

    center1 = p1.offset(side, center_offset)
    center2 = p2.offset(side, center_offset)

    a = center1.offset(side, -half_width)
    b = center2.offset(side, -half_width)
    c = center2.offset(side,  half_width)
    d = center1.offset(side,  half_width)

    model.start_operation("Aramis MDF Groove 3mm x 8mm", true)

    begin
      # Make a shallow rectangular cutting profile on the selected MDF face.
      groove_face = ents.add_face(a, b, c, d)
      raise "نتوانستم سطح شیار را بسازم." unless groove_face && groove_face.valid?

      # IMPORTANT: do not use the face normal to guess the vertical direction.
      # pushpull must follow the selected MDF face normal, toward the material.
      # We create the profile with the same normal as the MDF face and then
      # push it opposite to that normal, which cuts into the back side.
      if groove_face.normal.dot(face.normal) < 0
        groove_face.reverse!
      end

      # Selected face is the BACK surface of the MDF. Cut 8 mm into the MDF.
      groove_face.pushpull(-GROOVE_DEPTH)

      model.commit_operation
      model.selection.clear

      UI.messagebox(
        "شیار با موفقیت ایجاد شد.\n\n" \
        "ضخامت MDF: #{thickness_mm} میل\n" \
        "فاصله مرکز شیار از لبه: #{thickness_mm} میل\n" \
        "عرض شیار: 3 میل\n" \
        "عمق شیار: 8 میل\n" \
        "جهت: #{direction}"
      )
    rescue => e
      model.abort_operation
      UI.messagebox("شیار ایجاد نشد:\n#{e.message}")
    end
  end

  unless file_loaded?(__FILE__)
    UI.menu("Extensions").add_item("Aramis MDF Groove 3mm x 8mm") { self.run }
    file_loaded(__FILE__)
  end
end
