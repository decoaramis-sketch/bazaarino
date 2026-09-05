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
      UI.messagebox("ابتدا یک لبه از سطح MDF را انتخاب کن.")
      return
    end

    # Thickness is also the distance from the selected edge to the groove.
    prompts = ["ضخامت MDF (میل‌متر):", "جهت شیار:"]
    defaults = ["16", "سمت اول"]
    lists = ["", "سمت اول|سمت دوم"]
    values = UI.inputbox(prompts, defaults, lists, "Aramis MDF Groove")
    return unless values

    thickness_mm = values[0].to_f
    direction = values[1].to_s

    if thickness_mm <= 0
      UI.messagebox("ضخامت MDF باید بیشتر از صفر باشد.")
      return
    end

    face = edge.faces.find { |f| f.valid? && f.plane }
    unless face
      UI.messagebox("برای این لبه یک سطح معتبر پیدا نشد.")
      return
    end

    p1 = edge.start.position
    p2 = edge.end.position
    line_dir = p2 - p1
    if line_dir.length <= 0.1.mm
      UI.messagebox("لبه انتخاب‌شده خیلی کوتاه است.")
      return
    end
    line_dir.normalize!

    # A vector perpendicular to the selected edge and lying on the MDF face.
    side = line_dir.cross(face.normal)
    if side.length <= 0.001.mm
      UI.messagebox("جهت شیار قابل تشخیص نیست.")
      return
    end
    side.normalize!
    side.reverse! if direction == "سمت دوم"

    # Move the groove by exactly the MDF thickness from the selected edge.
    offset = thickness_mm.mm
    center1 = p1.offset(side, offset)
    center2 = p2.offset(side, offset)
    half_width = GROOVE_WIDTH / 2.0

    a = center1.offset(side, -half_width)
    b = center2.offset(side, -half_width)
    c = center2.offset(side,  half_width)
    d = center1.offset(side,  half_width)

    ents = model.active_entities
    unless edge.parent == ents
      UI.messagebox("اگر MDF داخل Group یا Component است، ابتدا وارد همان Group/Component شو و سپس لبه را انتخاب کن.")
      return
    end

    model.start_operation("Aramis MDF Groove 3mm x 8mm", true)

    begin
      groove_face = ents.add_face(a, b, c, d)
      raise "نتوانستم سطح شیار را بسازم." unless groove_face

      # The groove is cut 8 mm into the MDF. Reverse the face if required so
      # pushpull goes into the material rather than outward.
      if groove_face.normal.dot(face.normal) > 0
        groove_face.reverse!
      end

      groove_face.pushpull(GROOVE_DEPTH)

      model.commit_operation
      model.selection.clear
      UI.messagebox(
        "شیار با موفقیت ایجاد شد.\n\n" \
        "فاصله از لبه: #{thickness_mm.to_s} میل\n" \
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
